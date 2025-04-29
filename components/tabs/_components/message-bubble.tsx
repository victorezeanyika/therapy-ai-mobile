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
       
        {isUser ? (
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <Image
          source={require('@/assets/images/you.png')} // 👈 We'll add a bot avatar here
          style={styles.avatar}
          />
          <Text style={styles.senderName}>You</Text>
          </View>
      ) : (
        <View style={{flexDirection:'row', alignItems:'center'}}>
        <Image
          source={require('@/assets/images/serentis-ai.png')} // 👈 We'll add a bot avatar here
          style={styles.avatar}
          />
          <Text style={styles.senderName}>Dr. Lukas</Text>
          </View>
      )}
        <Markdown
          style={{
            body: isUser ? styles.userText : styles.botText,
            heading1: {
              fontSize: 20,
              fontWeight: 'bold',
              marginTop:20,
              marginBottom: 10,
              color: isUser ? 'white' : '#000000',
            },
            paragraph: {
              marginTop: 12,
              marginBottom: 12,
            }
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
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 16,
    marginRight: 8,
  },
  senderName: {
    fontFamily: 'Gotham-Bold',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: Colors.harmony.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: 'white',
    fontFamily: 'Gotham-Medium',
    fontSize: 12,
    lineHeight: 17,
  },
  botText: {
    color: '#000000',
    fontFamily: 'Gotham-Medium',
    fontSize: 12,
    lineHeight: 17,
  },
});
