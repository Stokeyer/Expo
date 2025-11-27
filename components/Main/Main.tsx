import { Category } from './components/Category';
import { Header } from './components/Header';
import { Popular } from './components/Popular';
import { View, ScrollView } from 'react-native';

type MainProps = {
  onItemPress?: (item: any) => void;
};

export function Main({ onItemPress }: MainProps) {
  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full items-center bg-white"
        contentContainerStyle={{ paddingBottom: 70 }}>
        <Header />
        <Category/>
        <Popular onItemPress={onItemPress} />
      </ScrollView>
    </View>
  );
}