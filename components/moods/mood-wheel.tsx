import React, { useState, useCallback } from "react";
import { View, Platform } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { ThemedText } from "../ThemedText";

interface MoodWheelProps {
  onSelect: (mood: string) => void;
}

export const MOODS = [
  {
    label: "very-sad",
    displayLabel: "Sad",
    color: "#A3C4F3",
    children: ["Bored", "Lonely", "Insecure", "Rejected"],
  },
  {
    label: "sad",
    displayLabel: "Fear",
    color: "#F7A072",
    children: ["Mad", "Hurt", "Threatened"],
  },
  {
    label: "neutral",
    displayLabel: "Disgust",
    color: "#FFE156",
    children: ["Confused", "Startled", "Amazed", "Excited"],
  },
  {
    label: "happy",
    displayLabel: "Happy",
    color: "#A8E6CF",
    children: ["Joyful", "Proud", "Optimistic", "Peaceful"],
  },
  {
    label: "amazing",
    displayLabel: "Surprise",
    color: "#B8E994",
    children: ["Disapproval", "Awful", "Avoidance"],
  },
];

const WIDTH = 400;
const HEIGHT = 400;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const OUTER_RADIUS = 160;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

const MoodWheel: React.FC<MoodWheelProps> = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSubMoods, setSelectedSubMoods] = useState<string[]>([]);

  const mainAnglePerMood = 360 / MOODS.length;

  const handleMoodSelect = useCallback((mood: string) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
      setSelectedSubMoods([]);
    } else {
      setSelectedMood(mood);
      setSelectedSubMoods([]);
    }
  }, [selectedMood]);

  const handleSubMoodSelect = useCallback((subMood: string) => {
    setSelectedSubMoods(prev => {
      const isSelected = prev.includes(subMood);
      const newSubMoods = isSelected 
        ? prev.filter(m => m !== subMood)
        : [...prev, subMood];
      
      const parentMood = MOODS.find(mood => mood.children.includes(subMood));
      if (parentMood) {
        setTimeout(() => onSelect(`${parentMood.label}|${newSubMoods.join(',')}`), 0);
      }
      return newSubMoods;
    });
  }, [onSelect]);

  const getTextRotation = (angle: number) => {
    let rotation = angle - 90;
    if (rotation > 90 && rotation < 270) {
      rotation += 180;
    }
    return rotation;
  };

  const touchProps = Platform.select({
    ios: {
      onPress: true,
    },
    android: {
      onPress: true,
      onPressIn: true,
      delayPressIn: 0,
    },
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={WIDTH} height={HEIGHT}>
        <G>
          {/* Main moods */}
          {MOODS.map((mood, index) => {
            const startAngle = index * mainAnglePerMood;
            const endAngle = (index + 1) * mainAnglePerMood;
            const midAngle = (startAngle + endAngle) / 2;
            const textRadius = OUTER_RADIUS * 0.7;
            const textPos = polarToCartesian(CENTER_X, CENTER_Y, textRadius, midAngle);

            return (
              <G key={`main-${mood.label}`}>
                <Path
                  d={describeArc(CENTER_X, CENTER_Y, OUTER_RADIUS, startAngle, endAngle)}
                  fill={mood.color}
                  stroke="#fff"
                  strokeWidth={2}
                  opacity={selectedMood && selectedMood !== mood.label ? 0.3 : 1}
                  onPress={() => handleMoodSelect(mood.label)}
                  {...(Platform.OS === 'android' && {
                    onPressIn: () => handleMoodSelect(mood.label),
                    delayPressIn: 0
                  })}
                />
                {selectedSubMoods.length === 0 && (
                  <SvgText
                    x={textPos.x}
                    y={textPos.y}
                    fill="#333"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    onPress={() => handleMoodSelect(mood.label)}
                    {...(Platform.OS === 'android' && {
                      onPressIn: () => handleMoodSelect(mood.label),
                      delayPressIn: 0
                    })}
                  >
                    {mood.displayLabel}
                  </SvgText>
                )}
              </G>
            );
          })}

          {/* Sub-moods */}
          {selectedMood && MOODS.map((mood) => {
            if (mood.label !== selectedMood) return null;

            const mainIndex = MOODS.findIndex(m => m.label === selectedMood);
            const startMainAngle = mainIndex * mainAnglePerMood;
            const subAnglePerChild = mainAnglePerMood / mood.children.length;

            return mood.children.map((child, subIndex) => {
              const subStart = startMainAngle + subIndex * subAnglePerChild;
              const subEnd = subStart + subAnglePerChild;
              const subMid = (subStart + subEnd) / 2;
              const innerRadius = OUTER_RADIUS * 0.5;
              const outerRadius = OUTER_RADIUS * 0.95;
              const textRadius = (innerRadius + outerRadius) / 2;
              const textPos = polarToCartesian(CENTER_X, CENTER_Y, textRadius, subMid);
              const rotation = getTextRotation(subMid);
              const isSelected = selectedSubMoods.includes(child);

              return (
                <G key={`sub-${child}`}>
                  <Path
                    d={describeArc(CENTER_X, CENTER_Y, outerRadius, subStart, subEnd)}
                    fill={mood.color}
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={!isSelected ? 0.3 : 1}
                    onPress={() => handleSubMoodSelect(child)}
                    {...(Platform.OS === 'android' && {
                      onPressIn: () => handleSubMoodSelect(child),
                      delayPressIn: 0
                    })}
                  />
                  <Path
                    d={describeArc(CENTER_X, CENTER_Y, innerRadius, subStart, subEnd)}
                    fill={mood.color}
                    stroke="#fff"
                    strokeWidth={2}
                    opacity={!isSelected ? 0.3 : 1}
                  />
                  <SvgText
                    x={textPos.x}
                    y={textPos.y}
                    fill="#333"
                    fontSize="14"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${rotation}, ${textPos.x}, ${textPos.y})`}
                    onPress={() => handleSubMoodSelect(child)}
                    {...(Platform.OS === 'android' && {
                      onPressIn: () => handleSubMoodSelect(child),
                      delayPressIn: 0
                    })}
                  >
                    {child}
                  </SvgText>
                </G>
              );
            });
          })}
        </G>
      </Svg>

      <ThemedText style={{ marginVertical: 20, fontSize: 18 }}>
        {selectedSubMoods.length > 0 
          ? `Selected: ${selectedSubMoods.join(', ')}` 
          : selectedMood 
            ? `Selected: ${MOODS.find(m => m.label === selectedMood)?.displayLabel}` 
            : "Tap a mood"}
      </ThemedText>
    </View>
  );
};

export default MoodWheel;