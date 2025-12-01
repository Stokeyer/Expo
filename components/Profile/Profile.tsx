import { View, Text, Pressable, ScrollView, Animated, Alert } from 'react-native';
import { useRef } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../hooks/useToast';

type SettingItem = {
  id: string;
  title: string;
  icon: 'location' | 'card' | 'bell' | 'settings';
};

const settingsItems: SettingItem[] = [
  { id: 'address', title: 'Адреса доставки', icon: 'location' },
  { id: 'payment', title: 'Способы оплаты', icon: 'card' },
  { id: 'notifications', title: 'Уведомления', icon: 'bell' },
  { id: 'app-settings', title: 'Настройки приложения', icon: 'settings' },
];

function AnimatedPressable({ 
  onPress, 
  children, 
  className 
}: { 
  onPress: () => void; 
  children: React.ReactNode;
  className?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
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
        className={className}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function SettingsIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'location':
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <Circle cx="12" cy="10" r="3" />
        </Svg>
      );
    case 'card':
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
          <Path d="M1 10h22" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="3" />
          <Path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
        </Svg>
      );
    default:
      return null;
  }
}

type ProfileProps = {
  userName: string;
  userEmail: string;
  onLogout: () => void;
};

export function Profile({ userName, userEmail, onLogout }: ProfileProps) {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const handleSettingPress = (settingId: string, title: string) => {
    toast.info(`${title} - раздел в разработке`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Шапка профиля */}
        <View 
          className="bg-red-500 px-6 pb-6 rounded-b-3xl"
          style={{ paddingTop: Math.max(insets.top, 20) + 20 }}
        >
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-white items-center justify-center">
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </Svg>
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-white">{userName}</Text>
              <Text className="text-sm text-white/90 mt-0.5">{userEmail}</Text>
            </View>
          </View>
        </View>

        {/* Настройки */}
        <View className="px-6 mt-6">
          <Text className="text-base font-semibold text-neutral-900 mb-3">Настройки</Text>
          
          <View className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
            {settingsItems.map((item, index) => (
              <View key={item.id}>
                <AnimatedPressable 
                  className="flex-row items-center justify-between px-4 py-4"
                  onPress={() => handleSettingPress(item.id, item.title)}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-9 h-9 rounded-full bg-red-50 items-center justify-center">
                      <SettingsIcon icon={item.icon} />
                    </View>
                    <Text className="text-sm font-medium text-neutral-900 ml-3">{item.title}</Text>
                  </View>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M9 18l6-6-6-6" />
                  </Svg>
                </AnimatedPressable>
                {index < settingsItems.length - 1 && (
                  <View className="h-[1px] bg-neutral-200 ml-16" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Кнопка выхода */}
        <View className="px-6 mt-6 mb-24">
          <AnimatedPressable 
            className="flex-row items-center justify-center py-4 rounded-2xl border border-red-500"
            onPress={handleLogout}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <Path d="M16 17l5-5-5-5" />
              <Path d="M21 12H9" />
            </Svg>
            <Text className="text-base font-semibold text-red-500 ml-2">Выйти из аккаунта</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </View>
  );
}

