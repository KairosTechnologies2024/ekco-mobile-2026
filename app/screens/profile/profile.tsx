import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();

  // Dummy profile data - replace with actual data fetching logic
  const profile = {
    name: 'Nhlamulo Magwaza',
    phoneNumber: '123-456-7890',
    identityNumber: '123456789',
    subscription: 'Ekco Basic (Fuel Cut)',
    vehiclesCount: 10,
    picture: require('../../../assets/images/user.png')
  };

  const handleChangePicture = () => {
    // Placeholder for image picker functionality
    Alert.alert('Change Picture', 'Image picker functionality to be implemented');
  };

  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-xl font-bold ml-4">Profile</Text>
      </View>

      {/* Profile Picture Section */}
      <View className="items-center mb-8">
        <Image
          source={profile.picture}
          className="w-40 h-40 rounded-full border-2 border-gray-300 mb-4"
        />
        <Pressable
          onPress={handleChangePicture}
          className="bg-blue-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Change Picture</Text>
        </Pressable>
      </View>

      {/* Profile Details */}
      <View className="space-y-4">
        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600 text-sm">Name</Text>
          <Text className="text-lg font-semibold">{profile.name}</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600 text-sm">Phone Number</Text>
          <Text className="text-lg font-semibold">{profile.phoneNumber}</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600 text-sm">Identity Number</Text>
          <Text className="text-lg font-semibold">{profile.identityNumber}</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600 text-sm">Subscription Package</Text>
          <Text className="text-lg font-semibold">{profile.subscription}</Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-gray-600 text-sm">Vehicles with Trackers</Text>
          <Text className="text-lg font-semibold">{profile.vehiclesCount}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <View className="flex-1 justify-end pb-4">
        <Pressable
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => router.replace('/screens/auth/auth') },
              ]
            );
          }}
          className="bg-red-500 px-4 py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
