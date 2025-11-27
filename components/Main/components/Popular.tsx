import { View, Text, Pressable, Image, Animated, Easing, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useEffect, useRef, useState } from 'react';

function PopularCard({ item, onPress }: { item: typeof PopularItems[0], onPress: () => void }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
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
        className="flex-row bg-white rounded-[20px] p-2 gap-3"
        style={{
          shadowColor: '#000',
          shadowOpacity: isPressed ? 0.08 : 0.04,
          shadowRadius: isPressed ? 10 : 6,
          shadowOffset: { width: 0, height: isPressed ? 4 : 1 },
          elevation: isPressed ? 3 : 1,
        }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image
          source={{ uri: item.image }}
          className="w-[90px] h-[90px] rounded-[16px]"
          resizeMode="cover"
        />
        <View className="flex-1 justify-between py-1">
          <View>
            <Text className="text-[15px] font-semibold text-neutral-900 leading-5">
              {item.name}
            </Text>
            <Text className="mt-1 text-[11px] text-neutral-400 leading-4" numberOfLines={2}>
              {item.compound}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-red-500">
              {item.price} ₽
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Svg width={13} height={13} viewBox="0 0 24 24" fill="#dc2626">
                <Path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </Svg>
              <Text className="text-[13px] font-semibold text-neutral-900">
                {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const PopularItems = [
  {
    id: 1,
    name: 'Филадельфия классическая',
    compound: 'Лосось, сливочный сыр, огурец, рис, нори',
    price: 450,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
  },
  {
    id: 2,
    name: 'Рамен с курицей',
    compound: 'Куриный бульон, лапша удон, яйцо, зеленый лук, нори',
    price: 380,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400',
  },
  {
    id: 3,
    name: 'Бенто сет',
    compound: 'Ассорти из риса, курицы терияки, овощей и роллов',
    price: 520,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400',
  },
];

type PopularProps = {
  onItemPress?: (item: typeof PopularItems[0]) => void;
};

export function Popular({ onItemPress }: PopularProps) {
  const animValues = useRef(
    PopularItems.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
      scale: new Animated.Value(0.9),
    }))
  ).current;

  useEffect(() => {
    const animations = animValues.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 500,
          delay: index * 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          delay: index * 150,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          delay: index * 150,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(80, animations).start();
  }, [animValues]);

  return (
    <View className="mt-8 w-[90%] h-[100%] self-center bg-white">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="rgb(220, 38, 38)"
            stroke="rgb(220, 38, 38)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-star text-primary fill-primary h-5 w-5">
            <Path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></Path>
          </Svg>
          <Text className="text-xl font-normal">Популярное</Text>
        </View>
        <Pressable
          className="flex-row items-center gap-1"
          onPress={() => Alert.alert('Переход в меню')}>
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

      <View className="mt-5 gap-y-3">
        {PopularItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={{
              opacity: animValues[index].opacity,
              transform: [
                { translateY: animValues[index].translateY },
                { scale: animValues[index].scale },
              ],
            }}>
            <PopularCard item={item} onPress={() => onItemPress?.(item)} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
