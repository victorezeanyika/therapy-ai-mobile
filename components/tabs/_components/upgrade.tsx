import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useGetProfileQuery } from "@/features/auth-api";

export default function Upgrade() {
  const { data: profile } = useGetProfileQuery();

  if (profile?.subscriptionStatus === "premium") {
    return null;
  }

  return (
    <View style={styles.upgradeCard}>
      <Text style={styles.upgradeTitle}>Upgrade to PRO</Text>
      <Text style={styles.upgradeText}>
        Get full access to all features and unlock the complete experience
        without any limitations.
      </Text>
      <TouchableOpacity
        onPress={() => {
          // router.push('/subscriptions');
          router.push("/(subscriptions)/basic");
        }}
        style={styles.upgradeButton}
      >
        <Feather name="zap" size={18} color="#282828" />
        <Text style={styles.upgradeButtonText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  upgradeCard: {
    backgroundColor: "#2a9d8f",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  upgradeTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "600",
    fontFamily: "Gotham-Medium",
    marginBottom: 12,
  },
  upgradeText: {
    color: "white",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Gotham-Medium",
  },
  upgradeButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 39,
    width: 120,
  },
  upgradeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Gotham-Medium",
    fontWeight: "600",
    color: "#282828",
  },
});
