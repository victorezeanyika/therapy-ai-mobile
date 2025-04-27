import React, { createContext, useContext, useState } from 'react';
import { Animated, Easing, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Haptic } from 'expo-haptics';
import { useThemeColor } from '@/hooks/useThemeColor';

// Toast types
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

  const bgColor = useThemeColor({ light: '#4CAF50', dark: '#2C6B2F' }, 'background'); // Success color
  const errorBgColor = useThemeColor({ light: '#F44336', dark: '#D32F2F' }, 'background'); // Error color
  const infoBgColor = useThemeColor({ light: '#2196F3', dark: '#1976D2' }, 'background'); // Info color

  const toastBgColor = toast?.type === 'success' ? bgColor : toast?.type === 'error' ? errorBgColor : infoBgColor;

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    // Haptic feedback
    if (type === 'error') {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
    } else if (type === 'success') {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
    } else {
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    }

    // Animate toast in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Hide toast after 3 seconds
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
      setTimeout(() => setToast(null), 500); // Remove toast after fade-out
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
            { backgroundColor: toastBgColor, opacity: fadeAnim },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => setToast(null)}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    textAlign: 'left',
  },
  closeButton: {
    paddingLeft: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
});
