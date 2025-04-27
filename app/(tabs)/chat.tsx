import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMotivationalQuote, featuresData } from '../../features/mockApi';
import FeatureCard from '../../components/tabs/_components/feature-card';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [quote, setQuote] = useState('');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    async function loadQuote() {
      const fetchedQuote = await fetchMotivationalQuote();
      setQuote(fetchedQuote);
    }
    loadQuote();
  }, []);

  const handleSend = () => {
    if (inputText.trim() !== '') {
      navigation.navigate('chat-detail' as never, { message: inputText } as never);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ThemedView style={styles.container}>
        <Image
          source={require('../../assets/images/frame1.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View>
          <ThemedText style={styles.title}>Welcome to Serentis</ThemedText>
          <ThemedText style={styles.subtitle}>
            Serentis blends cutting-edge technology with empathy to support your mental wellness journey
          </ThemedText>
        </View>

        <ThemedView 
          darkColor="#232627"
          lightColor="#8383830D"
          style={styles.inputContainer}
        >
          <TextInput
            placeholder="I need some motivational quote"
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
          />
          <TouchableOpacity style={styles.quoteButton} onPress={handleSend}>
            <MaterialIcons name="send" size={20} color="white" />
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={featuresData}
          renderItem={({ item }) => <FeatureCard feature={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuresList}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 26, justifyContent: 'flex-end', gap: 40, alignItems: 'center' },
  image: {
    maxWidth: 224,
    maxHeight: 224,
    height: 300,
    marginTop: '30%',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    justifyContent: 'space-between',
    width: '100%',
    borderColor: '#E0E0E0',
    borderRadius: 10,
  },
  input: {
    padding: 10,
    width: '80%',
    color:Colors.harmony.primary,
    fontSize:14,
    fontWeight:'500',
    fontFamily:'Gotham-Medium',
  },
  quoteButton: {
    backgroundColor: Colors.harmony.primary,
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  featuresList: { 
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
