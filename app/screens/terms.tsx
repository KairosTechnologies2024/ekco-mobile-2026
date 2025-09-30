import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsAndConditions() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const termsSections = [
    {
      title: "Acceptance of Terms",
      icon: "checkmark-circle-outline",
      content: "By accessing and using Ekco's GPS tracking services, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "Service Description",
      icon: "car-outline",
      content: "Ekco provides GPS tracking and fleet management solutions designed to help businesses monitor and manage their vehicles effectively. Our services include real-time tracking, route optimization, and performance analytics."
    },
    {
      title: "User Responsibilities",
      icon: "person-outline",
      content: "Users are responsible for maintaining the confidentiality of their account credentials, ensuring the accuracy of provided information, and complying with all applicable laws and regulations while using our services."
    },
    {
      title: "Service Availability",
      icon: "time-outline",
      content: "While we strive to provide continuous service availability, we do not guarantee uninterrupted access to our services. Maintenance, updates, and unforeseen circumstances may temporarily affect service availability."
    },
    {
      title: "Limitation of Liability",
      icon: "warning-outline",
      content: "Ekco shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our total liability shall not exceed the amount paid for our services."
    },
    {
      title: "Governing Law",
      icon: "globe-outline",
      content: "These terms and conditions are governed by and construed in accordance with the laws of South Africa, and any disputes shall be subject to the exclusive jurisdiction of the courts of South Africa."
    },
    {
      title: "Contact Information",
      icon: "mail-outline",
      content: "For questions regarding these terms and conditions, please contact us at legal@kairostechnology.co.za"
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6 px-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">Terms & Conditions</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="document-text-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">Terms & Conditions</Text>
          </View>

          <Text className="text-base text-black dark:text-white leading-6 mb-4">
            Last updated: October 2025
          </Text>

          <Text className="text-base text-black dark:text-white leading-6">
            Please read these terms and conditions carefully before using Ekco's GPS tracking and fleet management services. These terms govern your use of our services and form a legally binding agreement between you and Ekco.
          </Text>
        </View>

        {/* Terms Sections */}
        {termsSections.map((section, index) => (
          <View key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4">
            <View className="flex-row items-center mb-4">
              <Ionicons
                name={section.icon as any}
                size={24}
                color="#0a7ea4"
                style={{ marginRight: 12 }}
              />
              <Text className="text-lg font-bold text-black dark:text-white">{section.title}</Text>
            </View>

            <Text className="text-base text-black dark:text-white leading-6">
              {section.content}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View className="pb-8 pt-4">
          <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 Ekco. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
