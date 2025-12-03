import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

interface MenuItem {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

type MenuItemCardProps = {
  item: MenuItem;
  formatPrice: (price: string) => string;
  onPress: () => void;
  onQuickAdd: () => void;
};

const CARD_MIN_HEIGHT = 270;
const ACTION_BUTTON_SIZE = 30;

export const MenuItemCard = memo<MenuItemCardProps>(({ item, formatPrice, onPress, onQuickAdd }) => {
  return (
    <TouchableOpacity
      className="w-[48%] mb-4"
      activeOpacity={0.9}
      onPress={() => {
        if (onPress) {
          onPress();
        } else {
          console.warn('onPress не передан в MenuItemCard');
        }
      }}
    >
      <View
        className="bg-white rounded-3xl overflow-hidden shadow-md shadow-black/5 border border-gray-100"
        style={{ minHeight: CARD_MIN_HEIGHT }}
      >
        {/* Изображение */}
        <View className="relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-36"
            resizeMode="cover"
          />
        </View>

        {/* Информация */}
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text
              className="text-sm font-semibold text-neutral-900"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              className="mt-1 text-xs text-neutral-500"
              numberOfLines={2}
            >
              {item.description?.replace(/\n/g, ' ') || ''}
            </Text>
          </View>
        
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-lg font-bold text-neutral-900">
              {formatPrice(item.price)}
            </Text>
            <Pressable
              className="bg-red-600 rounded-full items-center justify-center w-7 h-7"
              style={({ pressed }) => [
                { 
                  width: ACTION_BUTTON_SIZE, 
                  height: ACTION_BUTTON_SIZE,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              onPress={() => {
                if (onQuickAdd) {
                  onQuickAdd();
                }
              }}
            >
              <Svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={2}
              >
                <Path d="M12 5v14M5 12h14" />
              </Svg>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Кастомная функция сравнения для оптимизации
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.price === nextProps.item.price &&
    prevProps.item.image === nextProps.item.image
  );
});

MenuItemCard.displayName = 'MenuItemCard';
