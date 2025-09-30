import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function About() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const appInfo = {
    name: "Ekco Tracking Mobile",
    version: "2.0.0",
    packageName: "com.kts.ekcotrackingmobile2026",
    description: "Advanced GPS tracking and fleet management solution."
  };

  const ekcoInfo = {
    company: "Ekco",
    tagline: "Next Generation Of Vehicle Tracking",
    description: "Ekco provides cutting-edge GPS tracking solutions designed to optimize fleet operations, improve driver safety, and enhance business efficiency. Our comprehensive platform offers real-time tracking, detailed analytics, and intelligent insights to help vehicle owners make data-driven decisions.",
    features: [
      "Real-time GPS tracking",
      "Fleet management tools",
      "Early Alerts",
      "Fuel Cuts",
      "24/7 Support",
      "Comprehensive reporting"
    ]
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6 px-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">About</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* App Information Section */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="information-circle-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">App Information</Text>
          </View>

          <View className="space-y-3">
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium">App Name</Text>
              <Text className="text-lg text-black dark:text-white">{appInfo.name}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium">Version</Text>
              <Text className="text-lg text-black dark:text-white">{appInfo.version}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium">Package</Text>
              <Text className="text-sm text-gray-800 dark:text-gray-200 font-mono">{appInfo.packageName}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium">Description</Text>
              <Text className="text-base text-black dark:text-white leading-5">{appInfo.description}</Text>
            </View>
          </View>
        </View>

        {/* Ekco Information Section */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="business-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">About Ekco</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-lg font-semibold text-black dark:text-white mb-2">{ekcoInfo.company}</Text>
              <Text className="text-base text-blue-600 dark:text-blue-400 font-medium mb-3">{ekcoInfo.tagline}</Text>
              <Text className="text-base text-black dark:text-white leading-6">{ekcoInfo.description}</Text>
            </View>

            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">Key Features</Text>
              <View className="space-y-2">
                {ekcoInfo.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#10b981"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-base text-black dark:text-white">{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Contact/Support Section */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="help-circle-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">Support</Text>
          </View>

          <View className="space-y-3">
            <Text className="text-base text-black dark:text-white leading-5">
              For support, feature requests, or technical assistance, please contact our support team or visit our documentation.
            </Text>

            <View className="flex-row items-center pt-2">
              <Ionicons
                name="mail-outline"
                size={18}
                color={colorScheme === 'dark' ? '#fff' : '#000'}
                style={{ marginRight: 8 }}
              />
              <Text className="text-base text-black dark:text-white">support@kairostechnology.co.za</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="pb-8">
          <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Ekco. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
