import { View, Text, ScrollView, Pressable, Switch, Animated } from 'react-native';
import { useState, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../../hooks/useToast';

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
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

export function NotificationSettings({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      title: 'Email-уведомления',
      description: 'Получать уведомления на почту',
      enabled: false,
    },
    {
      id: 'sms',
      title: 'SMS-уведомления',
      description: 'Получать уведомления по SMS',
      enabled: false,
    },
    {
      id: 'promo',
      title: 'Промо-акции',
      description: 'Уведомления о скидках и специальных предложениях',
      enabled: true,
    }
  ]);

  const handleToggle = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
    const setting = settings.find(s => s.id === id);
    toast.success(
      setting?.enabled 
        ? `${setting.title} отключены` 
        : `${setting?.title} включены`
    );
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
            <Text className="text-xl font-semibold text-white flex-1">Уведомления</Text>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="bg-white rounded-2xl overflow-hidden border border-neutral-200 mb-24">
            {settings.map((setting, index) => (
              <View key={setting.id}>
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-1 mr-4">
                    <Text className="text-base font-semibold text-neutral-900 mb-1">
                      {setting.title}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      {setting.description}
                    </Text>
                  </View>
                  <Switch
                    value={setting.enabled}
                    onValueChange={() => handleToggle(setting.id)}
                    trackColor={{ false: '#e5e5e5', true: '#dc2626' }}
                    thumbColor="#ffffff"
                  />
                </View>
                {index < settings.length - 1 && (
                  <View className="h-[1px] bg-neutral-200 ml-4 mr-4" />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
