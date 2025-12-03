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
import { useAuthSession } from './hooks/useAuthSession';
import { useCart } from './hooks/useCart';

import './global.css';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const {
    isAuthenticated,
    isAuthReady,
    userEmail,
    userName,
    login,
    logout,
  } = useAuthSession();

  const {
    cartItems,
    setCartItems,
    selectedItem,
    setSelectedItem,
    isBasketOpen,
    openBasket,
    closeBasket,
    addToCart,
    clearCart,
    cartItemsCount,
  } = useCart();

  const [activeScreen, setActiveScreen] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleLogin = (email: string, name: string) => {
    login(email, name);
    setActiveScreen('main');
  };

  const handleLogout = () => {
    logout();
    clearCart();
    setActiveScreen('main');
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'basket') {
      openBasket();
      return;
    }

    if (screen === activeScreen) return;

    // Сбрасываем категорию при переходе на menu через Footer
    if (screen === 'menu') {
      setSelectedCategory(undefined);
    }

    setActiveScreen(screen);
    fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
      duration: 180,
        useNativeDriver: true,
    }).start();
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName === 'Все' ? undefined : categoryName);
    setActiveScreen('menu');
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigateToAddress = () => {
    // Закрываем корзину перед переходом
    closeBasket();
    setActiveScreen('profile');
    setOpenAddressForm(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const handleAddressFormOpened = () => {
    setOpenAddressForm(false);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'main':
        return <Main onItemPress={setSelectedItem} onCategoryPress={handleCategoryPress} onNavigateToAddress={handleNavigateToAddress} />;
      case 'menu':
        return <Menu onItemPress={setSelectedItem} onAddToCart={addToCart} initialCategory={selectedCategory} />;
      case 'profile':
        return (
          <Profile 
            userName={userName} 
            userEmail={userEmail} 
            onLogout={handleLogout}
            openAddressForm={openAddressForm}
            onAddressFormOpened={handleAddressFormOpened}
          />
        );
      default:
        return <Main onItemPress={setSelectedItem} onCategoryPress={handleCategoryPress} />;
    }
  };

  // Пока не знаем, есть ли сохранённая сессия — показываем просто белый экран
  if (!isAuthReady) {
    return (
      <SafeAreaProvider>
        <ToastProvider>
          <View className="bg-white flex-1">
            <StatusBar style="auto" />
          </View>
        </ToastProvider>
      </SafeAreaProvider>
    );
  }

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
            cartItemsCount={cartItemsCount}
          />

          {isBasketOpen && (
            <Basket 
              onClose={closeBasket}
              cartItems={cartItems}
              setCartItems={setCartItems}
              onNavigateToAddress={handleNavigateToAddress}
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
