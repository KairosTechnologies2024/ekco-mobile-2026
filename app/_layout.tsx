import { store } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from 'expo-linking';
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { Provider } from "react-redux";
import Sidebar from "../components/Sidebar";
import { authApi } from "../store/api/authApi";

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

  // ✅ Robust deep link handling
  useEffect(() => {
    let handled = false;

    const handleDeepLink = (url: string) => {
      if (handled) return;
      console.log('Handling deep link:', url);
      const parsed = Linking.parse(url);
      const path = parsed.path?.replace(/^\/+/, ''); // Remove leading slashes

      if (path === 'reset-password' && parsed.queryParams?.token) {
        handled = true;
        console.log('Navigating to reset-password screen with token:', parsed.queryParams.token);
        router.push(`/screens/auth/new-password?token=${parsed.queryParams.token}`);
      } else {
        console.log('Unhandled path or missing token in deep link');
      }
    };

    // Handle cold start
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Handle app already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, [router]);

  // WebSocket connection for live alerts updates
  useEffect(() => {
    const ws = new WebSocket('ws://192.168.10.41:3003');

    ws.onopen = () => {
      console.log('WebSocket connected for alerts');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'alert_update' && data.data) {
          const alerts = Array.isArray(data.data) ? data.data : [data.data];
          alerts.forEach((alert: any) => {
            if (alert.device_serial) {
              // Invalidate the cache for this serial to trigger refetch
              store.dispatch(authApi.util.invalidateTags([{ type: 'Alerts', id: alert.device_serial }]));
            }
          });
        }
      } catch (error) {
        console.log('Error parsing WebSocket alert message:', error);
      }
    };

    ws.onerror = (error) => {
      console.log('WebSocket error for alerts:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected for alerts');
    };

    return () => {
      ws.close();
    };
  }, []);

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
        />
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
  touchableArea: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
