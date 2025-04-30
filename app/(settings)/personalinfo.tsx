import { ThemedView } from "@/components/ThemedView";
import TopHeader from "@/components/TopHeader";
import { TouchableOpacity, View, Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import CustomFormField from "@/components/CustomFormField";
import { Image } from "expo-image";
import { useUpdateProfileMutation } from "@/features/auth-api";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useAppSelector } from "@/features/hooks";
const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profileImage: z.string().optional(),
});

type ProfileFormData = z.infer<typeof personalInfoSchema>;

export default function PersonalInfo() {
  const {user:userDetails} = useAppSelector(state => state.auth);
  const [updateProfile, { isLoading: isUpdate }] = useUpdateProfileMutation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  console.log(userDetails, 'this is the user details');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      profileImage: "",
    },
  });

  // Reset form when userDetails is available
  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        gender: userDetails?.gender || "",
        dateOfBirth: ""|| "",
        profileImage: userDetails?.avatar || "",
      });
    }
  }, [userDetails, reset]);
  
  // Image Picker
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setValue("profileImage", result.assets[0].uri);
    }
  };

  // Watch profile image
  const profileImage = watch("profileImage");

  return (
    <ThemedView style={{ marginTop: 20 }}>
      <TopHeader title="Personal Information" />
      <View style={{ padding: 20, justifyContent:'center', alignItems:'center' }}>
        {/* Profile Image Picker */}
        <View style={{
          position: 'relative',
          marginBottom: 20,
        }}>
          <View style={{
            height: 120,
            width: 120,
            borderRadius: 60,
            overflow: 'hidden',
            backgroundColor: Colors.harmony.light,
          }}>
            <Image
              source={{ uri: profileImage || "https://ui-avatars.com/api/?name=User&background=random" }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>
          <TouchableOpacity 
            onPress={handlePickImage}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: Colors.harmony.primary,
              padding: 8,
              borderRadius: 20,
              elevation: 2,
            }}
          >
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handlePickImage}
          style={{
            backgroundColor: Colors.harmony.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'Gotham-Book' }}>Change Photo</Text>
        </TouchableOpacity>
        <CustomFormField
          name="name"
          label="Full Name"
          placeholder="Enter your Full Name"
          control={control}
          errors={errors.name}
          fieldType="input"
          icon="user"
        />
        <CustomFormField
          name="email"
          label="Email"
          placeholder="Enter your Email"
          control={control}
          errors={errors.email}
          fieldType="input"
          icon="mail"
        />
        <CustomFormField
          control={control}
          name="gender"
          label="Gender"
          fieldType="select"
          placeholder="Select gender"
          icon="users"
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
          errors={errors.gender}
        />

        <View style={{ width: '100%', marginTop: 5 }}>
          <ThemedText 
            lightColor="#6C7278"
            darkColor="#ffffff"
            style={{
              fontSize: 12, 
              fontFamily: 'Gotham-Book',
            }}>
            Date of Birth
          </ThemedText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedView
              lightColor="#FFFFFF"
              darkColor="#232627"
              style={{
                borderRadius: 10,
                flexDirection: 'row',
                width: '100%',
                height: 46,
                alignItems: 'center',
                paddingHorizontal: 20,
                marginTop: 8,
              }}
            >
              <Feather name="calendar" size={16} color="#ACB5BB" />
              <Text style={{
                flex: 1,
                marginLeft: 10,
                fontFamily: 'Gotham-Book',
                fontSize: 14,
                color: Colors.harmony.light,
              }}>
                {watch("dateOfBirth") || "Select your date of birth"}
              </Text>
            </ThemedView>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(watch("dateOfBirth") || new Date())}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setValue("dateOfBirth", selectedDate.toISOString().split("T")[0]);
              }
            }}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit((data: ProfileFormData) => {
            updateProfile({payload:data});
          })}
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
