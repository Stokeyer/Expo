import { View, Text, Pressable, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useEffect, useRef } from 'react';

function CategoryCard({ 
  category, 
  onPress, 
  animValues 
}: { 
  category: typeof categories[0]; 
  onPress: () => void;
  animValues: { opacity: Animated.Value; translateY: Animated.Value };
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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
    <Animated.View
      className="aspect-square w-[30%]"
      style={{
        opacity: animValues.opacity,
        transform: [
          { translateY: animValues.translateY },
          { scale: scaleAnim }
        ],
      }}>
      <Pressable
        className="flex-1 flex-col items-center justify-center rounded-[24px] border border-[#ffdfe7] bg-white"
        style={{
          shadowColor: '#ffb4c9',
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View className="items-center justify-center gap-1">
          <Text className="text-3xl">{category.icon}</Text>
          <Text className="mb-5 text-base font-medium text-neutral-900">{category.label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Категории с наименьшим количеством букв (2 ряда по 3 колонки)
// Сеты (4), Роллы (5), Пицца (5), Салаты (6), Фастфуд (7), Суши-нигири (11)
const categories = [
  { id: 'sets', label: 'Сеты', icon: '🍱' },
  { id: 'rolls', label: 'Роллы', icon: '🍱' },
  { id: 'pizza', label: 'Пицца', icon: '🍕' },
  { id: 'salads', label: 'Салаты', icon: '🥗' },
  { id: 'fastfood', label: 'Фастфуд', icon: '🍔' },
  { id: 'sushi-nigiri', label: 'Суши-нигири', icon: '🍣' },
];

type CategoryProps = {
  onCategoryPress?: (categoryName: string) => void;
};

export function Category({ onCategoryPress }: CategoryProps) {
  const animValues = useRef(
    categories.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    const animations = animValues.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(50, animations).start();
  }, [animValues]);

  const handleCategoryPress = (categoryLabel: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryLabel);
    }
  };

  const handleAllPress = () => {
    if (onCategoryPress) {
      onCategoryPress('Все');
    }
  };

  return (
    <View className="mt-6 w-[92%] self-center bg-white">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-neutral-900">Категории</Text>
        <Pressable
          className="flex-row items-center gap-1"
          onPress={handleAllPress}>
          <Text className="text-base font-medium text-red-500">Все</Text>
          <Svg
            width={16}
            height={16}
            viewBox="0 0 20 20"
            fill="none"
            stroke="#f97373"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="m9 18 6-6-6-6" />
          </Svg>
        </Pressable>
      </View>
      <View className="mt-5 flex-row flex-wrap justify-between gap-y-5">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => handleCategoryPress(category.label)}
            animValues={animValues[index]}
          />
        ))}
      </View>
    </View>
  );
}
