import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NexLock() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const features = [
    {
      icon: "lock-closed-outline",
      title: "Remote Vehicle Locking",
      description: "Securely lock and unlock fleet vehicles remotely through our mobile app or web platform."
    },
    {
      icon: "shield-checkmark-outline",
      title: "Anti-Theft Protection",
      description: "Advanced security features to prevent unauthorized vehicle use and theft attempts."
    },
    {
      icon: "location-outline",
      title: "GPS Integration",
      description: "Seamlessly integrated with Ekco's GPS tracking system for real-time location monitoring."
    },
    {
      icon: "time-outline",
      title: "Scheduled Access",
      description: "Set up automated locking/unlocking schedules based on business hours and driver shifts."
    },
    {
      icon: "notifications-outline",
      title: "Instant Alerts",
      description: "Receive immediate notifications for unauthorized access attempts or security breaches."
    },
    {
      icon: "analytics-outline",
      title: "Usage Analytics",
      description: "Comprehensive reporting on vehicle access patterns and security events."
    }
  ];

  const benefits = [
    "Enhanced fleet security and theft prevention",
    "Remote vehicle immobilization capabilities",
    "Integration with existing Ekco tracking systems",
    "Real-time access control and monitoring",
    "Automated scheduling for operational efficiency",
    "Comprehensive audit trails and reporting"
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6 px-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">Nex-Lock</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="lock-closed-outline"
              size={32}
              color="#000"
              style={{ marginRight: 12 }}
            />
            <Text className="text-2xl font-bold text-black">Nex-Lock</Text>
          </View>

          <Text className="text-black text-lg mb-2">Next Generation Fleet Security</Text>
          <Text className="text-black leading-6">
            Advanced vehicle locking system designed specifically for fleet management. Secure your vehicles with cutting-edge technology that integrates seamlessly with Ekco's tracking solutions.
          </Text>
        </View>

        {/* Features Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black dark:text-white mb-4">Key Features</Text>

          {features.map((feature, index) => (
            <View key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3">
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color="#0a7ea4"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-lg font-bold text-black dark:text-white">
                  {feature.title}
                </Text>
              </View>

              <Text className="text-base text-gray-600 dark:text-gray-300 leading-6 ml-8">
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Benefits Section */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <Text className="text-xl font-bold text-black dark:text-white mb-4">
            Why Choose Nex-Lock?
          </Text>

          {benefits.map((benefit, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#10b981"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-black dark:text-white flex-1">
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Technical Specifications */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <Text className="text-xl font-bold text-black dark:text-white mb-4">
            Technical Specifications
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600 dark:text-gray-300">Compatibility</Text>
              <Text className="text-base text-black dark:text-white">Most fleet vehicles</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600 dark:text-gray-300">Connectivity</Text>
              <Text className="text-base text-black dark:text-white">GSM/GPS</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600 dark:text-gray-300">Battery Life</Text>
              <Text className="text-base text-black dark:text-white">Up to 30 days</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600 dark:text-gray-300">Operating Temperature</Text>
              <Text className="text-base text-black dark:text-white">-20°C to 60°C</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-6">
          <Text className="text-lg font-bold text-black dark:text-white mb-2">
            Ready to Secure Your Fleet?
          </Text>

          <Text className="text-base text-black dark:text-white leading-6 mb-4">
            Contact our sales team to learn more about Nex-Lock and how it can enhance your fleet security.
          </Text>

          <View className="flex-row items-center mb-4">
            <Ionicons
              name="mail-outline"
              size={20}
              color="#0a7ea4"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base text-black dark:text-white">
              admin@kairostechnology.co.za
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons
              name="call-outline"
              size={20}
              color="#0a7ea4"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base text-black dark:text-white">
              +27 12 345 6789
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="pb-8 pt-4">
          <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Ekco. Nex-Lock is a trademark of Kairos Technology Solutions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
