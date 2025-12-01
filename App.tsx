import { Main } from 'components/Main/Main';
import { Menu } from 'components/Menu/Menu';
import { Basket } from 'components/Basket/Basket';
import { Profile } from 'components/Profile/Profile';
import { Footer } from 'components/Footer';
import { Cards } from 'components/Cards/Cards';
import { Auth } from 'components/Auth/Auth';
import { View, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './hooks/useToast';

import './global.css';
import { StatusBar } from 'expo-status-bar';

type CartItem = {
  id: number;
  name: string;
  compound: string;
  price: number;
  rating: number;
  image: string;
  quantity: number;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [activeScreen, setActiveScreen] = useState('main');
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setCartItems([]);
    setActiveScreen('main');
  };

  const addToCart = (item: any, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setSelectedItem(null);
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'basket') {
      setIsBasketOpen(true);
      return;
    }

    if (screen === activeScreen) return;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setActiveScreen(screen), 150);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'main':
        return <Main onItemPress={setSelectedItem} />;
      case 'menu':
        return <Menu />;
      case 'profile':
        return <Profile userName={userName} userEmail={userEmail} onLogout={handleLogout} />;
      default:
        return <Main onItemPress={setSelectedItem} />;
    }
  };

  // Если пользователь не аутентифицирован, показываем экран входа
  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <ToastProvider>
          <View className="bg-white flex-1">
            <Auth onLogin={handleLogin} />
            <StatusBar style="auto" />
          </View>
        </ToastProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <View className="bg-white flex-1">
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            {renderScreen()}
          </Animated.View>
          
          <Footer 
            activeScreen={activeScreen} 
            onNavigate={handleNavigate}
            isBasketOpen={isBasketOpen}
            cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          />

          {isBasketOpen && (
            <Basket 
              onClose={() => setIsBasketOpen(false)} 
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          )}

          {selectedItem && (
            <Cards 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)}
              onAddToCart={addToCart}
            />
          )}
          
          <StatusBar style="auto" />
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
