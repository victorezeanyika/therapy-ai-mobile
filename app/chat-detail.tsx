import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import MessageBubble from '../components/tabs/_components/message-bubble';
import ActivityOptions from '../components/tabs/_components/activity-option';
import { useRoute } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateSessionMutation, useSendMessageMutation } from '@/features/chat-api';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface RouteParams {
  message?: string;
}

export default function ChatScreen() {
  const route = useRoute();
  const { message } = (route.params as RouteParams) || {};
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
  const [sendMessageMutation, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'The first step to improving your mental health skills is choosing a specific area to focus on. Do you have something in mind?' }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await createSession().unwrap();
        setSessionId(response.sessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
        // Handle error appropriately
      }
    };

    initializeSession();
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !sessionId) return;

    const userMessage = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessageMutation({
        message: textToSend,
        sessionId
      }).unwrap();

      const botMessage = { sender: 'bot' as const, text: response.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    if (message) {
      handleSendMessage(message);
    }
  }, [message]);

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Serentis" />
    
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 20 }}
        />
    
        <ActivityOptions activities={[]} />
    
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <MaterialCommunityIcons name="paperclip" size={24} color="#9E9E9E" />
          </TouchableOpacity>
    
          <TextInput
            style={styles.input}
            placeholder="Write a message..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#bbb"
          />
    
          <TouchableOpacity 
            style={[styles.sendButton, (isSendingMessage || !sessionId) && styles.sendButtonDisabled]} 
            onPress={() => handleSendMessage(input)}
            disabled={isSendingMessage || !sessionId}
          >
            {isSendingMessage ? (
              <ActivityIndicator color="white" />
            ) : (
              <MaterialCommunityIcons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    margin: 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 10,
    height: 60,
  },
  attachButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00B894',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
});
