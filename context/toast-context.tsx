import React, { createContext, useContext, useState } from 'react';
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptic from 'expo-haptics';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextProps {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const bgColor = useThemeColor({ light: '#4CAF50', dark: '#2C6B2F' }, 'background');
  const errorBgColor = useThemeColor({ light: '#F44336', dark: '#D32F2F' }, 'background');
  const infoBgColor = useThemeColor({ light: '#2196F3', dark: '#1976D2' }, 'background');

  const toastBgColor = toast?.type === 'success' ? bgColor : toast?.type === 'error' ? errorBgColor : infoBgColor;

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    if (type === 'error') {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
    } else if (type === 'success') {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
    } else {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
      setTimeout(() => setToast(null), 500);
    }, 3000);
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const info = (message: string) => showToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}

      {/* Toast UI */}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { backgroundColor: toastBgColor, opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 50], // Animate from above screen to a fixed top position
            }) }] },
          ]}
        >
          <ThemedText style={styles.toastText}>{toast.message}</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={() => setToast(null)}>
            <Ionicons name="close" size={18} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50, // top not bottom
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999, // Always stay on top
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 999,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
