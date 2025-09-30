import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicy() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const privacySections = [
    {
      title: "Information We Collect",
      icon: "document-text-outline",
      content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, phone number, and vehicle information."
    },
    {
      title: "How We Use Your Information",
      icon: "settings-outline",
      content: "We use the collected information to provide, maintain, and improve our GPS tracking services, process transactions, send you technical notices and support messages, and respond to your comments and questions."
    },
    {
      title: "Information Sharing",
      icon: "shield-checkmark-outline",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law."
    },
    {
      title: "Data Security",
      icon: "lock-closed-outline",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
    },
    {
      title: "Your Rights",
      icon: "person-outline",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of certain communications and data processing activities."
    },
    {
      title: "Contact Us",
      icon: "mail-outline",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@kairostechnology.co.za"
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6 px-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">Privacy Policy</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">Privacy Policy</Text>
          </View>

          <Text className="text-base text-black dark:text-white leading-6 mb-4">
            Last updated: October 2025
          </Text>

          <Text className="text-base text-black dark:text-white leading-6">
            This Privacy Policy describes how Ekco ("we", "our", or "us") collects, uses, and protects your information when you use our GPS tracking and fleet management services.
          </Text>
        </View>

        {/* Privacy Sections */}
        {privacySections.map((section, index) => (
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
