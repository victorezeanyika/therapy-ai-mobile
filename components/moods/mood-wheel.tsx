import React, { useState } from "react";
import { View, Text } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { ThemedText } from "../ThemedText";

interface MoodWheelProps {
  onSelect: (mood: string) => void;
}

const MOODS = [
  {
    label: "Sad",
    color: "#A3C4F3",
    children: ["Bored", "Lonely", "Insecure", "Rejected"],
  },

  {
    label: "Anger",
    color: "#F7A072",
    children: ["Mad", "Hurt", "Threatened"],
  },
  {
    label: "Surprise",
    color: "#FFE156",
    children: ["Confused", "Startled", "Amazed", "Excited"],
  },
  {
    label: "Happy",
    color: "#A8E6CF",
    children: ["Joyful", "Proud", "Optimistic", "Peaceful"],
  },
  {
    label: "Disgust",
    color: "#B8E994",
    children: ["Disapproval", "Awful", "Avoidance"],
  },
];

const WIDTH = 336;
const HEIGHT = 338;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const INNER_RADIUS = 0;  // 👈 Set to 0!
const OUTER_RADIUS = 110;
const SUB_OUTER_RADIUS = 160;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r1: number, r2: number, startAngle: number, endAngle: number) {
  const startOuter = polarToCartesian(cx, cy, r2, startAngle);
  const endOuter = polarToCartesian(cx, cy, r2, endAngle);
  const startInner = polarToCartesian(cx, cy, r1, endAngle);
  const endInner = polarToCartesian(cx, cy, r1, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuter.x, startOuter.y,
    "A", r2, r2, 0, largeArcFlag, 1, endOuter.x, endOuter.y,
    "L", startInner.x, startInner.y,
    "A", r1, r1, 0, largeArcFlag, 0, endInner.x, endInner.y,
    "Z",
  ].join(" ");
}

const MoodWheel: React.FC<MoodWheelProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const mainAnglePerMood = 360 / MOODS.length;

  const handleMoodSelect = (mood: string) => {
    setSelected(mood);
    onSelect(mood);
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={WIDTH} height={HEIGHT}>
        <G>
          {/* Inner main moods */}
          {MOODS.map((mood, index) => {
            const startAngle = index * mainAnglePerMood;
            const endAngle = (index + 1) * mainAnglePerMood;
            const midAngle = (startAngle + endAngle) / 2;
            const textPos = polarToCartesian(CENTER_X, CENTER_Y, (INNER_RADIUS + OUTER_RADIUS) / 2, midAngle);

            return (
              <G key={`main-${mood.label}`}>
                <Path
                  d={describeArc(CENTER_X, CENTER_Y, INNER_RADIUS, OUTER_RADIUS, startAngle, endAngle)}
                  fill={mood.color}
                  stroke="#fff"
                  strokeWidth={2}
                  onPress={() => handleMoodSelect(mood.label)}
                />
                <SvgText
                  x={textPos.x}
                  y={textPos.y}
                  fill="#333"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {mood.label}
                </SvgText>
              </G>
            );
          })}

          {/* Outer sub-moods */}
          {MOODS.map((mood, index) => {
            const startAngle = index * mainAnglePerMood;
            const endAngle = (index + 1) * mainAnglePerMood;
            const moodAngleSpan = endAngle - startAngle;
            const subAnglePerChild = moodAngleSpan / mood.children.length;

            return mood.children.map((child, subIndex) => {
              const subStart = startAngle + subIndex * subAnglePerChild;
              const subEnd = subStart + subAnglePerChild;
              const subMid = (subStart + subEnd) / 2;
              const textPos = polarToCartesian(CENTER_X, CENTER_Y, (OUTER_RADIUS + SUB_OUTER_RADIUS) / 2, subMid);

              return (
                <G key={`sub-${child}`}>
                  <Path
                    d={describeArc(CENTER_X, CENTER_Y, OUTER_RADIUS, SUB_OUTER_RADIUS, subStart, subEnd)}
                    fill={mood.color}
                    stroke="#fff"
                    strokeWidth={2}
                    onPress={() => handleMoodSelect(child)}
                  />
                  <SvgText
                    x={textPos.x}
                    y={textPos.y}
                    fill="#333"
                    fontSize="8"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {child}
                  </SvgText>
                </G>
              );
            });
          })}
        </G>
      </Svg>

      {/* Selected mood */}
      <ThemedText style={{ marginVertical: 20, fontSize: 18 }}>
        {selected ? `Selected: ${selected}` : "Tap a mood"}
      </ThemedText>
    </View>
  );
};

export default MoodWheel;
