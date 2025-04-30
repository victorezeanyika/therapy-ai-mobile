import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import CustomFormField from '@/components/CustomFormField';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForgotPasswordMutation } from '@/features/auth-api';
import { useToast } from '@/context/toast-context';
import TopHeader from '@/components/TopHeader';

export default function ForgotPassword() {
  const { success, error: toastError } = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .transform((val) => val.toLowerCase()),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await forgotPassword(data).unwrap();
      success('Password reset instructions sent to your email');
      router.replace("/(auth)");
    } catch (error: any) {
      toastError(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          'An error occurred'
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* <TopHeader title="Forgot Password" /> */}
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password
        </ThemedText>

        <CustomFormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          control={control}
          errors={errors.email}
          fieldType="input"
          icon="mail"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && { opacity: 0.5 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>
            Back to Login
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '20%',
  },
  content: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.harmony.primary,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Gotham-Book',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.harmony.primary,
    fontSize: 14,
    fontFamily: 'Gotham-Book',
  },
}); 