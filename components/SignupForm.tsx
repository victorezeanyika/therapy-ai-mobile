import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import CustomFormField from './CustomFormField';
import { useRegisterMutation } from '@/features/auth-api';

const userSignupSchema = z.object({
  name: z.string().min(2, { message: "Full Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmpassword: z.string(),
}).refine((data) => data.password === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

export default function SignupForm() {
  const [register, {isLoading}] = useRegisterMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof userSignupSchema>>({
    resolver: zodResolver(userSignupSchema),
  });

  const onSubmit = async (data: z.infer<typeof userSignupSchema>) => {
    try {
      const { name, email, password } = data;
      console.log(data, 'datasd')
      const user = await register({ name, email, password }).unwrap();
      await AsyncStorage.setItem('user', JSON.stringify(user));
      Alert.alert("Success", "Signup successful");
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomFormField
        name="name"
        label="Full Name"
        placeholder="Enter your Full Name"
        control={control}
        errors={errors.name}
        fieldType="input"
        icon='user'
      />
      <CustomFormField
        name="email"
        label="Email"
        placeholder="Enter your Passpadi Email"
        control={control}
        errors={errors.email}
        fieldType="input"
        icon='mail'
      />
      <CustomFormField
        name="password"
        label="Password"
        placeholder="Enter your Password"
        control={control}
        errors={errors.password}
        fieldType="input"
        icon='lock'
      />
      <CustomFormField
        name="confirmpassword"
        label="Confirm Password"
        placeholder="Confirm your Password"
        control={control}
        errors={errors.confirmpassword}
        fieldType="input"
        icon='lock'
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <ThemedText type='subtitle' style={styles.dividerText}>or Continue with</ThemedText>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.harmony.primary,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Gotham-Book',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 40,
    height: 40,
  },
});
