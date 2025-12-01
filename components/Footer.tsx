import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FooterProps = {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isBasketOpen?: boolean;
  cartItemsCount?: number;
};

export function Footer({ activeScreen, onNavigate, isBasketOpen, cartItemsCount = 0 }: FooterProps) {
  const insets = useSafeAreaInsets();
  
  const isActive = (screen: string) => {
    if (screen === 'basket') return isBasketOpen;
    return activeScreen === screen;
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200">
      <View 
        className="flex-row items-center justify-around py-3 px-4"
        style={{ paddingBottom: Math.max(12, insets.bottom) }}
      >
        <Pressable onPress={() => onNavigate('main')} className="items-center gap-1">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={isActive('main') ? '#dc2626' : '#737373'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
          </Svg>
          <Text className={`text-xs font-medium ${isActive('main') ? 'text-red-500' : 'text-neutral-500'}`}>Главная</Text>
        </Pressable>

        <Pressable onPress={() => onNavigate('menu')} className="items-center gap-1">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={isActive('menu') ? '#dc2626' : '#737373'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 12h16M4 6h16M4 18h16" />
          </Svg>
          <Text className={`text-xs font-medium ${isActive('menu') ? 'text-red-500' : 'text-neutral-500'}`}>Меню</Text>
        </Pressable>

        <Pressable onPress={() => onNavigate('basket')} className="items-center gap-1">
          <View className="relative">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={isActive('basket') ? '#dc2626' : '#737373'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <Path d="M3 6h18" />
              <Path d="M16 10a4 4 0 0 1-8 0" />
            </Svg>
            {cartItemsCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-[10px] font-bold text-white">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
          </View>
          <Text className={`text-xs font-medium ${isActive('basket') ? 'text-red-500' : 'text-neutral-500'}`}>Корзина</Text>
        </Pressable>

        <Pressable onPress={() => onNavigate('profile')} className="items-center gap-1">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={isActive('profile') ? '#dc2626' : '#737373'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <Path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          </Svg>
          <Text className={`text-xs font-medium ${isActive('profile') ? 'text-red-500' : 'text-neutral-500'}`}>Профиль</Text>
        </Pressable>
      </View>
    </View>
  );
}