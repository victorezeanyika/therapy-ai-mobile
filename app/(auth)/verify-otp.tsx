import { View, Text, StyleSheet, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, router } from 'expo-router';
import { useVerifyOtpMutation } from '@/features/auth-api';
import { ThemedView } from '@/components/ThemedView';
import BackButton from '@/components/ui/backbutton';
import { ThemedText } from '@/components/ThemedText';

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { email } = useLocalSearchParams();
  const [verifyOtp, {isLoading}] = useVerifyOtpMutation();

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (text === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length === 6) {
      Keyboard.dismiss();
      try {
        await verifyOtp({ email, otp: code }).unwrap();
        router.push('/(tabs)/explore');
      } catch (error: any) {
        alert(error?.data?.message || error?.data?.error || error?.message || 'An error occurred');
      }
    } else {
      alert('Please enter the full 6-digit code');
    }
  };
  

  return (
    <ThemedView
    lightColor='#F7F4F2'
    darkColor='#141718'
    style={styles.container}>
    <BackButton />
        <View 
        style={{
        marginTop:56,
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
        }}>
      <ThemedText 
      type='title' 
      style={{
      }}>0TP</ThemedText>
      <ThemedText style={styles.title}>Verification Code</ThemedText>
      <ThemedText
      darkColor='#969696'
      type='subtitle'
       style={styles.subtitle}>
        We have sent an OTP code to your email.
      </ThemedText>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          autoFocus={index === 0}
          returnKeyType="next"
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    marginTop:50,
  },
  title: {
    fontWeight: 'medium',
    fontFamily:'Gotham-Book',
    fontSize:20,
    marginBottom: 8,
    marginTop:20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop:50,
    gap:5,
  },
  otpInput: {
    width: 59,
    height: 63,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Colors.harmony.primary,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.harmony.primary,
  },
  button: {
    backgroundColor: Colors.harmony.primary,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
