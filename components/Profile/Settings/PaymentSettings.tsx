import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useState, useRef } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PaymentMethod = {
  id: string;
  type: 'card' | 'cash' | 'online';
  title: string;
  description: string;
  icon: string;
  isDefault: boolean;
  cardNumber?: string;
  cardHolder?: string;
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

export function PaymentSettings({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'cash',
      title: 'Наличными',
      description: 'Оплата при получении',
      icon: 'cash',
      isDefault: true,
    },
  ]);



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
            <Text className="text-xl font-semibold text-white flex-1">Способы оплаты</Text>
          </View>
        </View>

        <View className="px-6 mt-6">
          {/* Список способов оплаты */}
          {paymentMethods.map((method) => (
            <View key={method.id} className="bg-white rounded-2xl p-4 mb-4 border border-neutral-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mr-3">
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <Circle cx="12" cy="12" r="10" />
                      <Path d="M12 6v12M9 9h6M9 15h6" />
                    </Svg>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-base font-semibold text-neutral-900">{method.title}</Text>
                      {method.isDefault && (
                        <View className="ml-2 px-2 py-0.5 bg-red-100 rounded-full">
                          <Text className="text-xs font-medium text-red-600">По умолчанию</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-sm text-neutral-600">{method.description}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Информация об оплате */}
          <View className="bg-white rounded-2xl p-4 mb-24 border border-neutral-200">
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3 mt-0.5">
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <Path d="M9 12l2 2 4-4" />
                </Svg>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-neutral-900 mb-1">
                  Оплата только наличными
                </Text>
                <Text className="text-sm text-neutral-600">
                  В нашем заведении принимается оплата только наличными средствами при получении заказа.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
