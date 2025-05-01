import ConversationsHeader from '@/components/conversions/header';
import Recents from '@/components/conversions/recents';
import { ThemedView } from '@/components/ThemedView';
import TopHeader from '@/components/TopHeader';
import { useGetAllSessionsQuery } from '@/features/chat-api';

export default function ConversationsScreen() {
  const { data } = useGetAllSessionsQuery();
  const stats = data?.stats;

  return (
    <ThemedView style={{
      flex: 1,
      paddingTop: 30,
      
    }}>
      <TopHeader title='My Conversations' />
      <ConversationsHeader  stats={stats}/>
      <Recents sessions={data?.sessions} />


    </ThemedView>
  );
}
