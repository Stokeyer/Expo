import { View, Text, Animated, Pressable } from 'react-native';
import { useEffect, useRef } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
};

export function Toast({ message, type = 'info', duration = 3000, onHide }: ToastProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Показать toast
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Скрыть через duration
    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="#10b981" />
            <Path
              d="M9 12l2 2 4-4"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'error':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="#ef4444" />
            <Path
              d="M15 9l-6 6M9 9l6 6"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        );
      case 'warning':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="#f59e0b" />
            <Path
              d="M12 8v4M12 16h.01"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        );
      case 'info':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill="#3b82f6" />
            <Path
              d="M12 16v-4M12 8h.01"
              stroke="#fff"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        );
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-600',
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          border: 'border-amber-600',
        };
      case 'info':
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-600',
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Math.max(insets.top, 20) + 10,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <Pressable onPress={hideToast}>
        <View
          className={`${colors.bg} rounded-2xl px-4 py-4 flex-row items-center shadow-lg border-2 ${colors.border}`}
        >
          <View className="mr-3">{getIcon()}</View>
          <Text className="text-base font-semibold text-white flex-1">{message}</Text>
          <Pressable onPress={hideToast} className="ml-2">
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
              <Path d="M18 6L6 18M6 6l12 12" />
            </Svg>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

