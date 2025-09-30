import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  devicesNeedingAttention?: number;
}


const menuItems = [
  { label: 'Device Health', icon: 'hardware-chip-outline', route: '/screens/device-health', showBadge: true },
  { label: 'Support Tickets', icon: 'help-circle-outline', route: 'screens/tickets/tickets', showBadge: false },
  { label: 'Settings', icon: 'settings-outline', route: '/screens/settings', showBadge: false },
  { label: 'About', icon: 'information-circle-outline', route: '/screens/about', showBadge: false },
  { label: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/screens/privacy', showBadge: false },
  { label: 'Terms and Conditions', icon: 'document-text-outline', route: '/screens/terms', showBadge: false },
  { label: 'Blog', icon: 'globe-outline', route: '/screens/blog', showBadge: false },
  { label: 'Nex-Lock', icon: 'lock-closed-outline', route: '/screens/nex-lock', showBadge: false },
  { label: 'Logout', icon: 'log-out', route: '/screens/auth/auth', showBadge: false },
];
export default function Sidebar({ isVisible, onClose, devicesNeedingAttention = 2 }: SidebarProps) {
  const translateX = useSharedValue(width);

  React.useEffect(() => {
    translateX.value = withTiming(isVisible ? 0 : width, { duration: 300 });
  }, [isVisible]);

  const router = useRouter();

  const handlePress = (route: string) => {
    if (route === '/screens/auth/auth') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            onPress: () => {
              onClose();
              router.push(route as any);
            },
          },
        ]
      );
    } else {
      onClose();
      router.push(route as any);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.min(Math.max(0, event.translationX), width);
    })
    .onEnd(() => {
      if (translateX.value > width / 2) {
        translateX.value = withTiming(width, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sidebar, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Ekco</Text>
          </View>
          <View style={styles.menu}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handlePress(item.route)}
              >
                <Ionicons name={item.icon as any} size={20} color="#fff" />
                <Text style={styles.menuText}>{item.label}</Text>
                {item.showBadge && devicesNeedingAttention > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{devicesNeedingAttention}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#182f51',
    zIndex: 2,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menu: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'relative',
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 15,
    flex: 1,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
