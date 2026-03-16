import { Slot, useRootNavigationState, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { auth } from "../constants/FirebaseConfig";


export default function RootLayout() {
  // 1 - параметри маршрутизації
  const router = useRouter();
  const navifationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false)

  const [user, setUser] = useState<any>(null);

  // 2 - перевірка автентифікації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setIsReady(true);
    });
    return unsubscribe;
  }, []);

  // 3 - навігація в залежності від стану автентифікації
  useEffect(() => {
    if (!isReady || !navifationState?.key) {
      return;
    }
    if (!user) {
      router.replace("/auth");
    } else {
      router.replace("/(tabs)");
    }
  }, [isReady, user, navifationState?.key]);

  // 4 - індикатор завантаження під час перевірки автентифікації
  if (!isReady || !navifationState?.key) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#2196f3"/>
        <Text style={{ fontSize: 16, marginTop: 10 }} >Перевірка автентифікації...</Text>
      </View>
    )
  }
  
  // 5 - рендер основного контенту після перевірки автентифікації
  return <Slot />;
}
