import { store } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Provider } from "react-redux";
import Sidebar from "../components/Sidebar";

import "../global.css";

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const isAuthScreen = segments.some(seg => seg === 'auth');

  const handleLogout = () => {


  Alert.alert(
                  'Logout',
                  'Are you sure you want to logout?',
                  [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes', onPress: () => router.replace('/screens/auth/auth') },
                  ]
                );



  
  };

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "default",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#182f51",
            },
          }}
        >

        </Stack>
        {!isAuthScreen && (
          <>
            <Animated.View style={[styles.gearButton, animatedStyle]}>
              <TouchableOpacity
                onPress={() => setSidebarVisible(true)}
                style={styles.touchableArea}
              >
                <Ionicons name="settings" size={18} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          {/*   <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            </TouchableOpacity> */}
          </>
        )}
        <Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  gearButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#182f51',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#182f51',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  touchableArea: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
