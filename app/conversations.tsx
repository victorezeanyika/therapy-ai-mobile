import ConversationsHeader from '@/components/conversions/header';
import Recents from '@/components/conversions/recents';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Text, Image } from 'react-native';
import { View } from 'react-native';

export default function ConversationsScreen() {
  return (
    <ThemedView style={{
      flex: 1,
      paddingTop: 30,
      
    }}>
      <TopHeader title='My Conversations' />
      <ConversationsHeader />
      <Recents />


    </ThemedView>
  );
}
