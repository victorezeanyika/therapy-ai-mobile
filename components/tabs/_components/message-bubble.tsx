import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MessageBubbleProps {
  message: { sender: string; text: string };
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

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
          <Text style={[styles.senderName, isUser && styles.userSenderName]}>
            {isUser ? 'You' : 'Dr. Lukas'}
          </Text>
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
  bubble: {
    padding: 12,
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.08,
    // shadowRadius: 2,
    // elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.harmony.primary,
    borderBottomRightRadius: 4,
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
});