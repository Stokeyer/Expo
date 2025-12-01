import { View, Text, TextInput, Pressable, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState, useRef } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { API_URL } from '../../config/api';
import { useToast } from '../../hooks/useToast';

type AuthProps = {
  onLogin: (email: string, name: string) => void;
};

function AnimatedButton({ 
  onPress, 
  children, 
  disabled = false 
}: { 
  onPress: () => void; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={`bg-red-500 rounded-2xl py-4 items-center ${disabled ? 'opacity-50' : ''}`}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const toast = useToast();

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Введите корректный email');
      return;
    }

    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: isLogin ? undefined : name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isLogin ? 'Вы успешно вошли в аккаунт' : 'Регистрация завершена', 2000);
        setTimeout(() => {
          onLogin(email, data.user.name || name);
        }, 500);
      } else {
        toast.error(data.message || 'Что-то пошло не так');
      }
    } catch (error) {
      toast.error('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setIsLogin(!isLogin), 150);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View 
          className="bg-red-500 px-6 pb-8 rounded-b-[40px]"
          style={{ paddingTop: Math.max(insets.top, 20) + 40 }}
        >
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-4">
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </Svg>
            </View>
            <Text className="text-2xl font-bold text-white">Roll House Pizza</Text>
            <Text className="text-base text-white/90 mt-2">
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </Text>
          </View>
        </View>

        <Animated.View 
          className="flex-1 px-6 pt-8"
          style={{
            opacity: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          {!isLogin && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">Имя</Text>
              <TextInput
                className="bg-neutral-100 rounded-2xl px-4 py-4 text-base text-neutral-900"
                placeholder="Ваше имя"
                placeholderTextColor="#a3a3a3"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View className="mb-4">
            <Text className="text-sm font-semibold text-neutral-700 mb-2">Email</Text>
            <TextInput
              className="bg-neutral-100 rounded-2xl px-4 py-4 text-base text-neutral-900"
              placeholder="example@mail.com"
              placeholderTextColor="#a3a3a3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-semibold text-neutral-700 mb-2">Пароль</Text>
            <TextInput
              className="bg-neutral-100 rounded-2xl px-4 py-4 text-base text-neutral-900"
              placeholder="••••••••"
              placeholderTextColor="#a3a3a3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <AnimatedButton onPress={handleSubmit} disabled={loading}>
            <Text className="text-base font-semibold text-white">
              {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Text>
          </AnimatedButton>

          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-sm text-neutral-500">
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            </Text>
            <Pressable onPress={toggleMode} className="ml-2">
              <Text className="text-sm font-semibold text-red-500">
                {isLogin ? 'Зарегистрироваться' : 'Войти'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

