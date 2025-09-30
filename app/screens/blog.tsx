import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Blog() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const blogPosts = [
    {
      id: 1,
      title: "5 Ways GPS Tracking Can Improve Fleet Efficiency",
      excerpt: "Discover how real-time GPS tracking can help optimize routes, reduce fuel costs, and improve overall fleet performance.",
      date: "January 15, 2025",
      readTime: "5 min read",
      icon: "car-outline",
      category: "Fleet Management"
    },
    {
      id: 2,
      title: "The Future of Vehicle Tracking Technology",
      excerpt: "Explore emerging trends in GPS technology and how they're revolutionizing the transportation industry.",
      date: "January 10, 2025",
      readTime: "7 min read",
      icon: "rocket-outline",
      category: "Technology"
    },
    {
      id: 3,
      title: "Driver Safety: Best Practices for Fleet Operators",
      excerpt: "Learn essential safety protocols and how GPS tracking can help monitor and improve driver behavior.",
      date: "January 5, 2025",
      readTime: "6 min read",
      icon: "shield-checkmark-outline",
      category: "Safety"
    },
    {
      id: 4,
      title: "Reducing Operational Costs with Smart Tracking",
      excerpt: "How intelligent GPS solutions can help businesses cut costs and improve their bottom line.",
      date: "December 28, 2024",
      readTime: "4 min read",
      icon: "trending-down-outline",
      category: "Cost Optimization"
    },
    {
      id: 5,
      title: "Understanding GPS Accuracy and Its Impact",
      excerpt: "A deep dive into GPS accuracy factors and how they affect fleet management decisions.",
      date: "December 20, 2024",
      readTime: "8 min read",
      icon: "location-outline",
      category: "Technical"
    }
  ];

  const categories = ["All", "Fleet Management", "Technology", "Safety", "Cost Optimization", "Technical"];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center mb-6 px-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </Pressable>
        <Text className="text-xl font-bold ml-4 text-black dark:text-white">Blog</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="globe-outline"
              size={28}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-xl font-bold text-black dark:text-white">Ekco Blog</Text>
          </View>

          <Text className="text-base text-black dark:text-white leading-6">
            Stay updated with the latest insights, tips, and trends in GPS tracking and fleet management technology.
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View className="flex-row space-x-3">
            {categories.map((category, index) => (
              <Pressable
                key={index}
                className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full"
              >
                <Text className="text-blue-800 dark:text-blue-200 font-medium text-sm">
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Blog Posts */}
        {blogPosts.map((post) => (
          <Pressable
            key={post.id}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-4"
          >
            <View className="flex-row items-center mb-3">
              <Ionicons
                name={post.icon as any}
                size={20}
                color="#0a7ea4"
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {post.category}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {post.readTime}
              </Text>
            </View>

            <Text className="text-lg font-bold text-black dark:text-white mb-2">
              {post.title}
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-300 leading-6 mb-3">
              {post.excerpt}
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {post.date}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-blue-600 dark:text-blue-400 mr-2">
                  Read more
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#0a7ea4"
                />
              </View>
            </View>
          </Pressable>
        ))}

        {/* Newsletter Signup */}
        <View className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons
              name="mail-outline"
              size={24}
              color="#0a7ea4"
              style={{ marginRight: 12 }}
            />
            <Text className="text-lg font-bold text-black dark:text-white">
              Stay Updated
            </Text>
          </View>

          <Text className="text-base text-black dark:text-white leading-6 mb-4">
            Subscribe to our newsletter to receive the latest blog posts and industry insights directly in your inbox.
          </Text>

          <Pressable className="bg-blue-600 px-6 py-3 rounded-lg items-center">
            <Text className="text-white font-medium">Subscribe Now</Text>
          </Pressable>
        </View>

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
