import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Text, Alert } from 'react-native';
import MessageBubble from '../components/tabs/_components/message-bubble';
import ActivityOptions from '../components/tabs/_components/activity-option';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateSessionMutation, useSendMessageMutation, useGetSessionByIdQuery, useEndSessionMutation } from '@/features/chat-api';
import { useToast } from '@/context/toast-context';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface SendMessageResponse {
  userMessage: {
    role: string;
    content: string;
    timestamp: string;
  };
  aiMessage: {
    role: string;
    content: string;
    timestamp: string;
  };
  remainingMinutes: number;
}

export default function ChatScreen() {
  const { error: toastError, success } = useToast();
  const { sessionId: paramSessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [createSession, { isLoading: isCreatingSession }] = useCreateSessionMutation();
  const [sendMessageMutation, { isLoading: isSendingMessage }] = useSendMessageMutation();
  const [endSession] = useEndSessionMutation();
  const [sessionId, setSessionId] = useState<string | null>(paramSessionId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 60 minutes in seconds
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Fetch existing session data if sessionId is provided
  const { data: existingSession, isLoading: isLoadingSession } = useGetSessionByIdQuery(
    paramSessionId || '',
    { skip: !paramSessionId }
  );

  useEffect(() => {
    if (existingSession) {
      // Convert existing messages to chat format
      const formattedMessages = existingSession.messages.map((msg: any) => ({
        sender: msg.role === 'assistant' ? 'bot' : 'user',
        text: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleString()
      }));
      setMessages(formattedMessages);
    }
  }, [existingSession, paramSessionId]);

  useEffect(() => {
    const initializeNewSession = async () => {
    if (paramSessionId) return; // Skip if we have an existing session

      try {
        const response = await createSession().unwrap();
        success("Session Started, ends in 60 minutes");
        setSessionId(response.entryId);
        // Set initial message from the session response
        if (response.messages && response.messages.length > 0) {
          const initialMessage = response.messages[0];
          setMessages([{
            sender: 'bot',
            text: initialMessage.content,
            timestamp: new Date().toLocaleString()
          }]);
        }
        // Start countdown timer
        setIsSessionActive(true);
        setTimeLeft(60 * 60);
      } catch (error) {
        console.error('Failed to create session:', error);
        toastError("You are not able to start a new session, please upgrade your plan.");
        const errorMessage = { 
          sender: 'bot' as const, 
          text: "I apologize, but I'm having trouble starting our session. Could you please try again?",
          timestamp: new Date().toLocaleString()
        };
        setMessages([errorMessage]);
      }
    };

    initializeNewSession();
  }, [paramSessionId]);

  // Countdown timer effect
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsSessionActive(false);
          success("Session ended successfully");
          router.replace('/(tabs)');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !sessionId || !isSessionActive) return;
    const userMessage = { 
      sender: 'user' as const, 
      text: textToSend,
      timestamp: new Date().toLocaleString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessageMutation({
        message: textToSend,
        sessionId: sessionId
      }).unwrap();

      // Update timer with server's remaining minutes
      setTimeLeft(response.remainingMinutes * 60);

      const botMessage = { 
        sender: 'bot' as const, 
        text: response.aiMessage.content,
        timestamp: new Date(response.aiMessage.timestamp).toLocaleString()
      };
      setMessages(prev => [...prev, botMessage]);
      success("Message sent successfully");
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { 
        sender: 'bot' as const, 
        text: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
        timestamp: new Date().toLocaleString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;

    // Calculate if 30 minutes have passed
    const minutesPassed = Math.floor((60 * 60 - timeLeft) / 60);
    if (minutesPassed < 30) {
      toastError("You must wait at least 30 minutes before ending the session");
      return;
    }

    Alert.alert(
      "End Session",
      "Are you sure you want to end this session?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            try {
              await endSession(sessionId).unwrap();
              setIsSessionActive(false);
              success("Session ended successfully");
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Failed to end session:', error);
              toastError("Failed to end session. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (isLoadingSession || isCreatingSession) {
    return (
      <ThemedView style={styles.container}>
        <TopHeader title="Serentis" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00B894" />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TopHeader title="Serentis" />
      <View style={styles.timerContainer}>
        <View style={styles.timerRow}>
          <Text style={styles.timerText}>
            Session ends in: {formatTime(timeLeft)}
          </Text>
          <TouchableOpacity 
            style={[styles.endSessionButton, (timeLeft > 30 * 60) && styles.endSessionButtonDisabled]}
            onPress={handleEndSession}
            disabled={!isSessionActive || timeLeft > 30 * 60}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            {/* <MaterialCommunityIcons name="paperclip" size={24} color="#9E9E9E" /> */}
          </TouchableOpacity>
    
          <TextInput
            style={styles.input}
            placeholder="Write a message..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#bbb"
            editable={isSessionActive}
          />
    
          <TouchableOpacity 
            style={[styles.sendButton, (!isSessionActive || isSendingMessage || !sessionId || input.trim() === '') && styles.sendButtonDisabled]} 
            onPress={() => handleSendMessage(input)}
            disabled={!isSessionActive || isSendingMessage || !sessionId || input.trim() === ''}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: '#1F1F1F',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerText: {
    color: '#00B894',
    fontSize: 16,
    fontFamily: 'Gotham-Medium',
  },
  endSessionButton: {
    backgroundColor: '#FF4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSessionButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
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
    paddingHorizontal: 10,
    height: '100%',
    fontFamily: 'Gotham-Medium',
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
