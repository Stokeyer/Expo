import { Category } from './components/Category';
import { Header } from './components/Header';
import { Popular } from './components/Popular';
import { View, ScrollView } from 'react-native';

type MainProps = {
  onItemPress?: (item: any) => void;
  onCategoryPress?: (categoryName: string) => void;
  onNavigateToAddress?: () => void;
};

export function Main({ onItemPress, onCategoryPress, onNavigateToAddress }: MainProps) {
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full items-center bg-white"
        contentContainerStyle={{ paddingBottom: 70 }}>
        <Header onNavigateToAddress={onNavigateToAddress} />
        <Category onCategoryPress={onCategoryPress} />
        <Popular onItemPress={onItemPress} onCategoryPress={onCategoryPress} />
      </ScrollView>
    </View>
  );
}