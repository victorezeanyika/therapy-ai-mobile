import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import Markdown from 'react-native-markdown-display';

interface TherapySessionsProps {
  chatSessions: Array<{
    createdAt: string;
    summary: string;
  }>;
}

export default function TherapySessions({ chatSessions }: TherapySessionsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ThemedView 
      lightColor='#fff'
      darkColor='#232627'
      style={styles.container}
    >
      {chatSessions?.slice(0, 2).map((session, index) => (
        <View key={index} style={styles.sessionContainer}>
          <ThemedText style={styles.dateText}>
            Session on {formatDate(session.createdAt)}
          </ThemedText>
          <Markdown style={{
            body: styles.summaryText
          }}>
            {session.summary}
          </Markdown>
        </View>
      ))}
      {(!chatSessions || chatSessions.length === 0) && (
        <ThemedText style={styles.emptyText}>
          No therapy sessions yet
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  sessionContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2a9d8f',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 30,
    color: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});