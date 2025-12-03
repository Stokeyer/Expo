import { View, Text, Pressable, ScrollView, Animated, Modal, Dimensions } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../hooks/useToast';
import { AddressSettings } from './Settings/AddressSettings';
import { PaymentSettings } from './Settings/PaymentSettings';
import { NotificationSettings } from './Settings/NotificationSettings';
import { AppSettings } from './Settings/AppSettings';

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
  openAddressForm?: boolean;
  onAddressFormOpened?: () => void;
};

export function Profile({ userName, userEmail, onLogout, openAddressForm, onAddressFormOpened }: ProfileProps) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Автоматически открываем форму адреса, если требуется
  useEffect(() => {
    if (openAddressForm) {
      setActiveSetting('address');
      if (onAddressFormOpened) {
        // Небольшая задержка, чтобы форма успела открыться
        setTimeout(() => {
          onAddressFormOpened();
        }, 100);
      }
    }
  }, [openAddressForm]);

  const handleSettingPress = (settingId: string, title: string) => {
    setActiveSetting(settingId);
  };

  const handleBack = () => {
    setActiveSetting(null);
  };

  // Рендерим выбранный экран настроек
  if (activeSetting === 'address') {
    return <AddressSettings onBack={handleBack} autoOpenForm={openAddressForm} />;
  }
  if (activeSetting === 'payment') {
    return <PaymentSettings onBack={handleBack} />;
  }
  if (activeSetting === 'notifications') {
    return <NotificationSettings onBack={handleBack} />;
  }
  if (activeSetting === 'app-settings') {
    return <AppSettings onBack={handleBack} />;
  }

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
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

      {/* Модальное окно подтверждения выхода */}
      <LogoutConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </View>
  );
}

// Компонент модального окна подтверждения выхода
function LogoutConfirmationModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const cancelButtonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleConfirmPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handleConfirmPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handleCancelPressIn = () => {
    Animated.spring(cancelButtonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handleCancelPressOut = () => {
    Animated.spring(cancelButtonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: fadeAnim,
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                width: Dimensions.get('window').width - 48,
                maxWidth: 400,
                transform: [{ scale: scaleAnim }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="px-6 pt-6 pb-6">
                {/* Иконка */}
                <View className="items-center mb-4">
                  <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center">
                    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <Path d="M16 17l5-5-5-5" />
                      <Path d="M21 12H9" />
                    </Svg>
                  </View>
                </View>

                {/* Заголовок */}
                <Text className="text-xl font-bold text-neutral-900 text-center mb-2">
                  Выйти из аккаунта?
                </Text>

                {/* Описание */}
                <Text className="text-base text-neutral-600 text-center mb-6">
                  Вы уверены, что хотите выйти? Вам потребуется войти снова для доступа к аккаунту.
                </Text>

                {/* Кнопки */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Animated.View style={{ transform: [{ scale: cancelButtonScaleAnim }] }}>
                      <Pressable
                        onPress={onClose}
                        onPressIn={handleCancelPressIn}
                        onPressOut={handleCancelPressOut}
                        className="bg-neutral-100 rounded-xl py-3.5 px-4"
                      >
                        <Text className="text-base font-semibold text-center text-neutral-700">
                          Отмена
                        </Text>
                      </Pressable>
                    </Animated.View>
                  </View>
                  <View className="flex-1">
                    <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                      <Pressable
                        onPress={onConfirm}
                        onPressIn={handleConfirmPressIn}
                        onPressOut={handleConfirmPressOut}
                        className="bg-red-500 rounded-xl py-3.5 px-4"
                        style={{
                          shadowColor: '#dc2626',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 4,
                        }}
                      >
                        <Text className="text-base font-semibold text-center text-white">
                          Выйти
                        </Text>
                      </Pressable>
                    </Animated.View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

