import { View, Text, ScrollView, Pressable, Switch, Animated, Modal, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../../hooks/useToast';

type AppSetting = {
  id: string;
  title: string;
  description?: string;
  type: 'switch' | 'button';
  value?: boolean;
  action?: () => void;
};

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

// Компонент кастомного модального окна
function CustomModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
              }}
            >
              <View className="px-6 pt-6 pb-4">
                <Text className="text-xl font-semibold text-neutral-900 mb-4">
                  {title}
                </Text>
                {children}
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// Компонент кнопки в модальном окне
function ModalButton({
  onPress,
  title,
  variant = 'default',
  className = '',
}: {
  onPress: () => void;
  title: string;
  variant?: 'default' | 'danger' | 'cancel';
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

  const bgColor =
    variant === 'danger'
      ? 'bg-red-500'
      : variant === 'cancel'
      ? 'bg-neutral-100'
      : 'bg-red-500';
  const textColor =
    variant === 'cancel' ? 'text-neutral-700' : 'text-white';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`${bgColor} rounded-xl py-3 px-4 ${className}`}
      >
        <Text className={`text-base font-semibold text-center ${textColor}`}>
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function AppSettings({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [saveHistory, setSaveHistory] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(true);
  
  // Состояния для модальных окон
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleClearCache = () => {
    setShowClearCacheModal(true);
  };

  const handleConfirmClearCache = () => {
    setShowClearCacheModal(false);
    toast.success('Кэш очищен');
  };

  const handleClearHistory = () => {
    setShowClearHistoryModal(true);
  };

  const handleConfirmClearHistory = () => {
    setShowClearHistoryModal(false);
    toast.success('История очищена');
  };

  const handleAbout = () => {
    setShowAboutModal(true);
  };

  const settings: AppSetting[] = [
    {
      id: 'sounds',
      title: 'Звуки',
      description: 'Воспроизводить звуки уведомлений',
      type: 'switch',
      value: sounds,
    },
    {
      id: 'vibration',
      title: 'Вибрация',
      description: 'Вибрация при уведомлениях',
      type: 'switch',
      value: vibration,
    },
    {
      id: 'clear-cache',
      title: 'Очистить кэш',
      description: 'Освободить место на устройстве',
      type: 'button',
      action: handleClearCache,
    },
    {
      id: 'about',
      title: 'О приложении',
      type: 'button',
      action: handleAbout,
    },
  ];

  const handleToggle = (id: string) => {
    switch (id) {
      case 'save-history':
        setSaveHistory(!saveHistory);
        toast.info('Сохранение истории ' + (!saveHistory ? 'включено' : 'отключено'));
        break;
      case 'sounds':
        setSounds(!sounds);
        toast.info('Звуки ' + (!sounds ? 'включены' : 'отключены'));
        break;
      case 'vibration':
        setVibration(!vibration);
        toast.info('Вибрация ' + (!vibration ? 'включена' : 'отключена'));
        break;
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Шапка */}
        <View 
          className="bg-red-500 px-6 pb-6 rounded-b-3xl"
          style={{ paddingTop: Math.max(insets.top, 20) + 20 }}
        >
          <View className="flex-row items-center">
            <AnimatedPressable onPress={onBack} className="mr-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 12H5M12 19l-7-7 7-7" />
              </Svg>
            </AnimatedPressable>
            <Text className="text-xl font-semibold text-white flex-1">Настройки приложения</Text>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="bg-white rounded-2xl overflow-hidden border border-neutral-200 mb-24">
            {settings.map((setting, index) => (
              <View key={setting.id}>
                {setting.type === 'switch' ? (
                  <View className="flex-row items-center justify-between px-4 py-4">
                    <View className="flex-1 mr-4">
                      <Text className="text-base font-semibold text-neutral-900 mb-1">
                        {setting.title}
                      </Text>
                      {setting.description && (
                        <Text className="text-sm text-neutral-600">
                          {setting.description}
                        </Text>
                      )}
                    </View>
                    <Switch
                      value={setting.value}
                      onValueChange={() => handleToggle(setting.id)}
                      trackColor={{ false: '#e5e5e5', true: '#dc2626' }}
                      thumbColor="#ffffff"
                    />
                  </View>
                ) : (
                  <AnimatedPressable
                    onPress={setting.action || (() => {})}
                    className="flex-row items-center justify-between px-4 py-4"
                  >
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-neutral-900 mb-1">
                        {setting.title}
                      </Text>
                      {setting.description && (
                        <Text className="text-sm text-neutral-600">
                          {setting.description}
                        </Text>
                      )}
                    </View>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M9 18l6-6-6-6" />
                    </Svg>
                  </AnimatedPressable>
                )}
                {index < settings.length - 1 && (
                  <View className="h-[1px] bg-neutral-200 ml-4 mr-4" />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Модальное окно подтверждения очистки кэша */}
      <CustomModal
        visible={showClearCacheModal}
        onClose={() => setShowClearCacheModal(false)}
        title="Очистить кэш"
      >
        <View className="gap-4">
          <Text className="text-base text-neutral-600">
            Вы уверены, что хотите очистить кэш приложения? Это освободит место на устройстве.
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ModalButton
                onPress={() => setShowClearCacheModal(false)}
                title="Отмена"
                variant="cancel"
              />
            </View>
            <View className="flex-1">
              <ModalButton
                onPress={handleConfirmClearCache}
                title="Очистить"
                variant="danger"
              />
            </View>
          </View>
        </View>
      </CustomModal>

      {/* Модальное окно подтверждения очистки истории */}
      <CustomModal
        visible={showClearHistoryModal}
        onClose={() => setShowClearHistoryModal(false)}
        title="Очистить историю"
      >
        <View className="gap-4">
          <Text className="text-base text-neutral-600">
            Вы уверены, что хотите очистить историю заказов? Это действие нельзя отменить.
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <ModalButton
                onPress={() => setShowClearHistoryModal(false)}
                title="Отмена"
                variant="cancel"
              />
            </View>
            <View className="flex-1">
              <ModalButton
                onPress={handleConfirmClearHistory}
                title="Очистить"
                variant="danger"
              />
            </View>
          </View>
        </View>
      </CustomModal>

      {/* Модальное окно "О приложении" */}
      <CustomModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title="О приложении"
      >
        <View className="gap-4">
          <View className="items-center mb-2">
            <View className="w-20 h-20 bg-red-500 rounded-3xl items-center justify-center mb-4">
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <Path d="M3 6h18" />
                <Path d="M16 10a4 4 0 0 1-8 0" />
              </Svg>
            </View>
            <Text className="text-2xl font-bold text-neutral-900 mb-1">Rolls House Pizza</Text>
            <Text className="text-sm text-neutral-500">Версия 1.0.0</Text>
          </View>
          <Text className="text-base text-neutral-600 text-center">
            Приложение для заказа пиццы и роллов
          </Text>
          <View className="pt-2">
            <ModalButton
              onPress={() => setShowAboutModal(false)}
              title="OK"
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
}
