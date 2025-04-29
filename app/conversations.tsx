import ConversationsHeader from '@/components/conversions/header';
import Recents from '@/components/conversions/recents';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';


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
