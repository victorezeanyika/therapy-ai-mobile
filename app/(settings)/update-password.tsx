import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { TouchableOpacity, View, Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomFormField from "@/components/CustomFormField";
import { useUpdateProfileMutation } from "@/features/auth-api";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/features/hooks";
import { useToast } from "@/context/toast-context";







const passwordSchema = z.object({
  oldPassword: z.string().min(2, { message: "Old Password is required" }),
  newPassword: z.string().min(2, { message: "New Password is required" }),
  confirmPassword: z.string().min(2, { message: "Confirm Password is required" }),
});

type ProfileFormData = z.infer<typeof passwordSchema>;

export default function PersonalInfo() {
  const {user:userDetails} = useAppSelector(state => state.auth);
  const [updateProfile, { isLoading: isUpdate }] = useUpdateProfileMutation();
  const { success, error: toastError } = useToast();
  
  const { 
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  // Reset form when userDetails is available
  useEffect(() => {
    if (userDetails) {
      reset({
        oldPassword: userDetails?.oldPassword || "",
        newPassword: userDetails?.newPassword || "",
        confirmPassword: userDetails?.confirmPassword || "",  
      });
    }
  }, [userDetails, reset]);

  const handleUpdatePassword = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        payload: {
          currentPassword: data.oldPassword,
          newPassword: data.newPassword
        }
      }).unwrap();
      success("Password updated successfully");
    } catch (error: any) {
      toastError(error?.data?.message || "Failed to update password");
    }
  };    
  

  return (
    <ThemedView style={{ marginTop: 20 , flex: 1 }}>
      <TopHeader title="Update Password" />
      <View style={{ padding: 20, justifyContent:'center', alignItems:'center' }}>
        <CustomFormField
          name="oldPassword"
          label="Old Password"
          placeholder="Enter your Old Password"
          control={control}
          errors={errors.oldPassword}   
          fieldType="input"
          icon="lock"
          />
        <CustomFormField
          name="newPassword"
          label="New Password"
          placeholder="Enter your New Password"
          control={control}
          errors={errors.newPassword}
          fieldType="input"
          icon="lock"
          />
         <CustomFormField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Enter your Confirm Password"
          control={control}
          errors={errors.confirmPassword}
          fieldType="input"
          icon="lock"
          />


    
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(handleUpdatePassword)}
          style={{
            backgroundColor: Colors.harmony.primary,
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
            {isUpdate ? "Updating..." : "Update"}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
