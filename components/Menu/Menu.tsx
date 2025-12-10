import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';
import { API_ENDPOINTS } from '../../config/api';
import { MenuItemCard } from './MenuItemCard';
import { useToast } from '../../hooks/useToast';

interface MenuItem {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  category: string;
}

type MenuProps = {
  onItemPress?: (item: any) => void;
  onAddToCart?: (item: any, quantity: number) => void;
  initialCategory?: string;
};

const ALL_CATEGORY = 'Все';
const FILTER_BUTTON_SIZE = 32;
const CATEGORY_CHIP_HEIGHT = 26;
const CATEGORY_CHIP_MIN_WIDTH = 72;
const CARD_MIN_HEIGHT = 270;
const ACTION_BUTTON_SIZE = 30;

export function Menu({ onItemPress, onAddToCart, initialCategory }: MenuProps = {}) {
  const toast = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  // Устанавливаем категорию при изменении initialCategory
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.items.getCategories);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      // Backend уже возвращает категории в правильном порядке
      const normalized = Array.isArray(data)
        ? data
            .filter((c: string) => Boolean(c) && c.trim() !== '' && c !== ALL_CATEGORY)
            .map((c: string) => c.trim())
        : [];
      
      // "Все" всегда первое, остальные в порядке от backend
      const allCategories = [ALL_CATEGORY, ...normalized];
      if (__DEV__) {
      }
      setCategories(allCategories);
    } catch (e) { 
    }
  };

  const fetchItems = async (category?: string) => {
    try {
      setLoading(true);
      setError('');

      const normalizedCategory = category && category !== ALL_CATEGORY ? category : undefined;
      const url = normalizedCategory
        ? API_ENDPOINTS.items.getByCategory(encodeURIComponent(normalizedCategory))
        : API_ENDPOINTS.items.getAll;
      
      const response = await fetch(url);
      if (!response.ok) {
        setError('Не удалось загрузить товары');
        return;
      }

      const data = await response.json();
      // Убираем console.log в production для производительности
      if (__DEV__) {
        if (normalizedCategory) {
          const wrongCategory = data.filter((item: MenuItem) => item.category !== normalizedCategory);
          if (wrongCategory.length > 0) {
            console.warn(`⚠️ Найдено товаров с неправильной категорией:`, wrongCategory.map((i: MenuItem) => i.title));
          }
        }
      }
      setItems(data);
    } catch (e) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems(selectedCategory);
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    // Поиск работает ТОЛЬКО по названию блюда (title)
    return items.filter((item) => {
      return item.title.toLowerCase().includes(q);
    });
  }, [items, searchQuery]);

  const formatPrice = useCallback((price: string): string => {
    const digits = price.replace(/[^\d]/g, '');
    if (!digits) return price;
    return `${digits} ₽`;
  }, []);

  const parsePrice = useCallback((price: string): number => {
    const digits = price.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }, []);

  const convertToCardItem = useCallback((item: MenuItem) => {
    return {
      id: item.id,
      name: item.title,
      compound: item.description?.replace(/\n/g, ' ') || '',
      price: parsePrice(item.price),
      image: item.image,
      category: item.category,
    };
  }, [parsePrice]);

  const handleItemPress = useCallback((item: MenuItem) => {
    if (onItemPress) {
      const cardItem = convertToCardItem(item);
      onItemPress(cardItem);
    } else {
      console.warn('onItemPress не передан в Menu');
    }
  }, [onItemPress, convertToCardItem]);

  const handleQuickAdd = useCallback((item: MenuItem) => {
    if (onAddToCart) {
      const cardItem = convertToCardItem(item);
      onAddToCart(cardItem, 1);
      toast.success(`Добавлено: ${item.title}`);
    } else {
      console.warn('onAddToCart не передан в Menu');
    }
  }, [onAddToCart, convertToCardItem, toast]);

  return (
    <View className="flex-1 bg-neutral-50">
      {/* Заголовок */}
      <View className="pt-12 pb-3 px-4 bg-neutral-50">
        <Text className="text-3xl font-bold text-neutral-900">Меню</Text>
        <Text className="mt-1 text-sm text-neutral-500">
          Выберите категорию и добавьте блюдо в корзину
        </Text>
      </View>

      {/* Поиск и кнопка фильтра */}
      <View className="flex-row items-center px-4 py-3 bg-white border-y border-gray-100 shadow-sm">
        <View className="flex-1 flex-row items-center bg-neutral-100 rounded-2xl px-4 py-2.5">
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth={2}
          >
            <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </Svg>
          <TextInput
            className="flex-1 ml-2 text-[15px] text-neutral-900"
            placeholder="Поиск блюд..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
      </View>

      {/* Категории */}
      <View className="bg-neutral-50 border-b border-gray-100">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
      >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
                activeOpacity={0.9}
                className={`mr-2 px-3 rounded-full border items-center justify-center ${
                  isSelected
                    ? 'bg-red-600 border-red-600'
                    : 'bg-white border-gray-200'
            }`}
                style={{ minWidth: CATEGORY_CHIP_MIN_WIDTH, height: CATEGORY_CHIP_HEIGHT }}
          >
                <Text
                  className={`text-xs font-semibold text-center ${
                    isSelected ? 'text-white' : 'text-neutral-700'
                  }`}
                  numberOfLines={1}
                >
              {category}
            </Text>
          </TouchableOpacity>
            );
          })}
      </ScrollView>
      </View>

      {/* Список товаров */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#dc2626" />
          <Text className="mt-4 text-base text-neutral-500">Загрузка меню...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Svg
            width={64}
            height={64}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth={2}
          >
            <Path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </Svg>
          <Text className="mt-4 text-lg font-semibold text-neutral-900">{error}</Text>
          <TouchableOpacity 
            onPress={() => fetchItems(selectedCategory)}
            className="mt-4 bg-red-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-medium">Повторить</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          {filteredItems.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Svg
                width={64}
                height={64}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth={2}
              >
                <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </Svg>
              <Text className="mt-4 text-lg font-semibold text-neutral-900">
                Ничего не найдено
              </Text>
              <Text className="mt-2 text-sm text-neutral-500">Попробуйте изменить запрос</Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <MenuItemCard
                  item={item}
                  formatPrice={formatPrice}
                  onPress={() => handleItemPress(item)}
                  onQuickAdd={() => handleQuickAdd(item)}
                />
              )}
              columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={10}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#dc2626']}
                />
              }
            />
          )}
        </View>
      )}
    </View>
  );
}
