    import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { useDeleteAccountMutation } from "@/features/auth-api";
import { useToast } from "@/context/toast-context";
import { router } from "expo-router";
import { useAppDispatch } from "@/features/hooks";
import { logout } from "@/features/auth-slice";

export default function DeleteAccount() {
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const { success, error: toastError } = useToast();
  const dispatch = useAppDispatch();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount({ payload: {} }).unwrap();
              dispatch(logout());
              success("Account deleted successfully");
              router.replace("/(auth)");
            } catch (error: any) {
              toastError(error?.data?.message || "Failed to delete account");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ThemedView style={{ marginTop: 20 }}>
      <TopHeader title="Delete Account" />
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 16,
          color: 'red',
          marginBottom: 20,
          textAlign: 'center',
          fontFamily: 'Gotham-Book',
        }}>
          Once you delete your account, there is no going back. Please be certain.
        </Text>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={{
            backgroundColor: 'red',
            paddingVertical: 15,
            borderRadius: 10,
            width: '100%',
            marginTop: 30,
          }}
        >
          <Text style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 16,
            fontFamily: 'Gotham-Book',
          }}>
            {isLoading ? "Deleting..." : "Delete Account"}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
