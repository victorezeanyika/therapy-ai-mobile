import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <ThemedText type='subtitle' style={styles.rememberMeText}>Remember me</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity>
          <ThemedText type='subtitle' style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button}>
        <ThemedText style={styles.buttonText}>Login</ThemedText>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <ThemedText type='subtitle' style={styles.dividerText}>or login with</ThemedText>
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
        <ThemedText type='subtitle' style={styles.signupText}>Don't have an account? </ThemedText>
        <TouchableOpacity>
          <ThemedText type='subtitle' style={styles.signupLink}>Sign up</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  inputContainer: {
    gap: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
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
    justifyContent:'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    width:40,
    height:40,
  },
  socialButtonText: {
    color: '#666',
    fontSize: 14,
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
    fontWeight: 700,
    fontFamily:'Gotham-Bold'
  },
}); 