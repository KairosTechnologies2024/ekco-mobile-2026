import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [carFlagEnabled, setCarFlagEnabled] = useState(false);

  const handleThemeToggle = () => {
    // For now, this is dummy functionality - just toggles local state
    // In a real implementation, you would use a theme context or state management
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    Alert.alert(
      'Theme Changed',
      `Switched to ${newTheme ? 'Dark' : 'Light'} mode`,
      [{ text: 'OK' }]
    );
  };

  const handleAlertsToggle = () => {
    const newState = !alertsEnabled;
    setAlertsEnabled(newState);

    Alert.alert(
      'Alerts Setting Changed',
      `Alerts ${newState ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const handleTwoFactorToggle = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);

    Alert.alert(
      'Two-Factor Authentication',
      `Two-factor authentication ${newState ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const handleCarFlagToggle = () => {
    const newState = !carFlagEnabled;
    setCarFlagEnabled(newState);

    Alert.alert(
      'Car Flag Setting Changed',
      `Car flagged as about to be sold ${newState ? 'enabled' : 'disabled'}`,
      [{ text: 'OK' }]
    );
  };

  const handleDebitOrderPress = () => {
    Alert.alert(
      'Change Debit Order Date',
      'Select a new date for debit order',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 px-4 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">Settings</Text>
      </View>

      {/* Settings Options */}
      <View className="space-y-4">
        {/* Alerts Toggle */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Alerts</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Enable or disable push notifications
              </Text>
            </View>
          </View>
          <Switch
            value={alertsEnabled}
            onValueChange={handleAlertsToggle}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={alertsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Theme Toggle */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name={isDarkMode ? "moon-outline" : "sunny-outline"}
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Theme</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Switch between light and dark mode
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Two-Factor Authentication Toggle */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Two-Factor Authentication</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Enable additional security for your account
              </Text>
            </View>
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={handleTwoFactorToggle}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={twoFactorEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Flag Car as About to be Sold Toggle */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="car-outline"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Flag Car as About to be Sold</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Mark your car as pending sale
              </Text>
            </View>
          </View>
          <Switch
            value={carFlagEnabled}
            onValueChange={handleCarFlagToggle}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={carFlagEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {/* Change Debit Order Date */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="calendar-outline"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Change Debit Order Date</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Select a new date for your debit order
              </Text>
            </View>
          </View>
          <Pressable onPress={handleDebitOrderPress}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          </Pressable>
        </View>

        {/* Profile */}
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons
              name="person-outline"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
              style={{ marginRight: 12 }}
            />
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white">Profile</Text>
              <Text className="text-gray-600 dark:text-gray-300 text-sm">
                Manage your profile information
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.push('/screens/profile/profile')}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colorScheme === 'dark' ? '#fff' : '#000'}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
