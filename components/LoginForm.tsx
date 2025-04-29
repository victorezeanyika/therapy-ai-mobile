import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomFormField from './CustomFormField';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useLoginMutation } from '@/features/auth-api';
import { useToast } from '@/context/toast-context';
// import { useLoginMutation } from '@/store/api/authApi';

export default function LoginForm() {
  const {success, error:toastError} = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [login, {isLoading}] = useLoginMutation();

  const userLoginSchema = z.object({
    email: z
    .string()
    .email({ message: 'Invalid email address' })
    .transform((val) => val.toLowerCase()),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    try {
      const result = await login(data).unwrap();
      success('Login successful');
      router.replace({ pathname: '/(auth)/verify-otp', params: { email: data.email } });
    } catch (error: any) {
      toastError(error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        'An error occurred'
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomFormField
        name="email"
        label="Email"
        placeholder="Enter your Passpadi Email"
        control={control}
        errors={errors.email}
        fieldType="input"
        icon="user"
      />

      <CustomFormField
        name="password"
        label="Password"
        placeholder="Enter your Password"
        control={control}
        errors={errors.password}
        fieldType="input"
        icon="lock"
      />

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <ThemedText type="subtitle" style={styles.rememberMeText}>
            Remember me
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <ThemedText type="subtitle" style={styles.forgotPasswordText}>
            Forgot Password?
          </ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.5 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <ThemedText  style={styles.buttonText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <ThemedText type="subtitle" style={styles.dividerText}>
          or login with
        </ThemedText>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <ThemedText type="subtitle" style={styles.signupText}>
          Don't have an account?{' '}
        </ThemedText>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <ThemedText type="subtitle" style={styles.signupLink}>
            Sign up
          </ThemedText>
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.harmony.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.harmony.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPasswordText: {
    color: Colors.harmony.primary,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.harmony.primary,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'Gotham-Book'
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: Colors.harmony.primary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Gotham-Bold',
  },
});
