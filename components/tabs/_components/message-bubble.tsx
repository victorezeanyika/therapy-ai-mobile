import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface MessageBubbleProps {
  message: {
    sender: string; 
    text: string;
    timestamp: string;
  };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVoice = async () => {
    if (isPlaying) {
      await Speech.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await Speech.speak(message.text, {
      onDone: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.botRow]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <View style={styles.header}>
          <Image
            source={isUser 
              ? require('@/assets/images/you.png')
              : require('@/assets/images/serentis-ai.png')}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text style={[styles.senderName, isUser && styles.userSenderName]}>
              {isUser ? 'You' : 'Dr. Lukas'}
            </Text>
            <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
              {message.timestamp}
            </Text>
          </View>
          {!isUser && (
            <TouchableOpacity 
              style={styles.voiceButton} 
              onPress={handlePlayVoice}
            >
              <MaterialCommunityIcons 
                name={isPlaying ? "stop-circle" : "play-circle"} 
                size={24} 
                color={isUser ? '#FFFFFF' : Colors.harmony.primary} 
              />
            </TouchableOpacity>
          )}
        </View>
        <Markdown
          style={{
            body: isUser ? styles.userText : styles.botText,
            heading1: {
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 16,
              marginBottom: 8,
              color: isUser ? '#FFFFFF' : '#2C3E50',
              fontFamily: 'Gotham-Bold',
            },
            heading2: {
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 14,
              marginBottom: 7,
              color: isUser ? '#FFFFFF' : '#2C3E50',
              fontFamily: 'Gotham-Bold',
            },
            paragraph: {
              marginVertical: 8,
              lineHeight: 20,
            },
            link: {
              color: isUser ? '#E8F6FF' : Colors.harmony.primary,
              textDecorationLine: 'underline',
            },
            list_item: {
              marginVertical: 4,
              lineHeight: 20,
            },
            bullet_list: {
              marginVertical: 8,
            },
          }}
        >
          {message.text}
        </Markdown>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  senderName: {
    fontFamily: 'Gotham-Bold',
    fontSize: 14,
    color: '#2C3E50',
    letterSpacing: 0.1,
  },
  userSenderName: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontFamily: 'Gotham-Medium',
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  userTimestamp: {
    color: '#E8F6FF',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.harmony.primary,
    borderBottomRightRadius: 4,
    width: '80%',
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#FFFFFF',
    fontFamily: 'Gotham-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: '#2C3E50',
    fontFamily: 'Gotham-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  voiceButton: {
    marginLeft: 8,
    padding: 4,
  },
});