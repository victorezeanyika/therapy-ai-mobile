import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, FlatList,
  TextInput, KeyboardAvoidingView, Platform, Animated, Dimensions, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchMotivationalQuote, featuresData } from '../../features/mockApi';
import FeatureCard from '../../components/tabs/_components/feature-card';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

const screenWidth = Dimensions.get('window').width;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [quote, setQuote] = useState('');
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-screenWidth)).current;

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

  const toggleMenu = () => {
    const toValue = menuVisible ? -screenWidth : 0;
    Animated.timing(sidebarAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setMenuVisible(!menuVisible));
  };



  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <ThemedView style={styles.container}>
          {/* Sidebar */}
          {/* <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeIcon}>
            <MaterialIcons name="close" size={28} color={Colors.harmony.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.sidebarTitle}>My Conversations</ThemedText>
          {dummyConversations.map(conv => (
            <TouchableOpacity key={conv.id} style={styles.convoItem}>
              <ThemedText style={styles.convoText}>{conv.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </Animated.View> */}
          
          {/* Menu Icon */}
          {/* <TouchableOpacity style={styles.menuIcon} onPress={toggleMenu}>
            <MaterialIcons name="menu" size={28} color={Colors.harmony.primary} />
          </TouchableOpacity> */}
          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => router.push('/conversations')}
            >
              <ThemedText style={styles.linkText}>My Conversations</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => router.push('/activities')}
            >
              <ThemedText style={styles.linkText}>My Activities</ThemedText>
            </TouchableOpacity>
          </View>

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
              placeholderTextColor={useThemeColor({ light: Colors.harmony.text, dark: '#FFFFFF' }, 'text')}
            />
            <TouchableOpacity style={styles.quoteButton} onPress={handleSend}>
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </ThemedView>

          <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {featuresData.map((item) => (
              <FeatureCard key={item.id} feature={item} />
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 60, // Increased padding at the top
  },
  linksContainer: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  linkItem: {
    paddingTop: 15,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gotham-Medium',
  },
  image: {
    maxWidth: 224,
    maxHeight: 224,
    height: 300,
    marginTop: '20%',
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
    marginTop: 20,
  },
  input: {
    padding: 10,
    width: '80%',
    color: Colors.harmony.primary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Gotham-Medium',
  },
  closeIcon:{
    
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
  menuIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth * 0.8,
    backgroundColor: '#fff',
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 20,
    elevation: 5,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.harmony.primary,
  },
  convoItem: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  convoText: {
    fontSize: 16,
    color: '#333',
  },
});
