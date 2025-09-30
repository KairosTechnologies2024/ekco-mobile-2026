import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Device {
  id: number;
  name: string;
  vehicle: string;
  status: 'good' | 'bad' | 'healthy';
  batteryConnected: boolean;
  lastSeen: string;
}

export default function DeviceHealth() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock device data - replace with actual data fetching
  const devices: Device[] = [
    {
      id: 1,
      name: '823124054300435',
      vehicle: 'Toyota Camry',
      status: 'healthy',
      batteryConnected: true,
      lastSeen: '2 minutes ago'
    },
    {
      id: 2,
      name: '823124054300435',
      vehicle: 'Honda Civic',
      status: 'good',
      batteryConnected: true,
      lastSeen: '5 minutes ago'
    },
    {
      id: 3,
      name: '823124054300435',
      vehicle: 'Ford Mustang',
      status: 'bad',
      batteryConnected: false,
      lastSeen: '2 weeks ago'
    },
    {
      id: 4,
      name: '823124054300435',
      vehicle: 'Chevrolet Malibu',
      status: 'healthy',
      batteryConnected: true,
      lastSeen: '1 minute ago'
    },
    {
      id: 5,
      name: '823124054300435',
      vehicle: 'Nissan Altima',
      status: 'good',
      batteryConnected: true,
      lastSeen: '10 minutes ago'
    },
  ];

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'bad':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'healthy':
        return 'checkmark-circle';
      case 'good':
        return 'information-circle';
      case 'bad':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredDevices = devices.filter(device =>
    device.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDeviceCard = (device: Device) => (
    <View key={device.id} className="bg-white rounded-lg p-4 m-2 shadow-md">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="hardware-chip" size={24} color="#3b82f6" />
          <Text className="text-lg font-bold ml-2">{device.name}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(device.status)}`}>
          <View className="flex-row items-center">
            <Ionicons name={getStatusIcon(device.status) as any} size={16} />
            <Text className="ml-1 text-sm font-semibold capitalize">{device.status}</Text>
          </View>
        </View>
      </View>

      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <Ionicons name="car" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Linked Vehicle:</Text>
          <Text className="text-gray-900 font-semibold ml-1">{device.vehicle}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons
            name={device.batteryConnected ? "battery-charging" : "battery-dead"}
            size={20}
            color={device.batteryConnected ? "#10b981" : "#ef4444"}
          />
          <Text className="text-gray-600 ml-2">Battery Status:</Text>
          <Text className={`font-semibold ml-1 ${device.batteryConnected ? 'text-green-600' : 'text-red-600'}`}>
            {device.batteryConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time" size={20} color="#6b7280" />
          <Text className="text-gray-600 ml-2">Last Seen:</Text>
          <Text className="text-gray-900 ml-1">{device.lastSeen}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className={`flex-1 h-2 rounded-full mr-3 ${device.status === 'healthy' ? 'bg-green-200' : device.status === 'good' ? 'bg-blue-200' : 'bg-red-200'}`}>
          <View
            className={`h-full rounded-full ${
              device.status === 'healthy' ? 'bg-green-500' :
              device.status === 'good' ? 'bg-blue-500' : 'bg-red-500'
            }`}
            style={{ width: device.status === 'healthy' ? '100%' : device.status === 'good' ? '75%' : '25%' }}
          />
        </View>
        <Text className="text-sm text-gray-500">
          {device.status === 'healthy' ? '100%' : device.status === 'good' ? '75%' : '25%'} Health
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 px-4 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text className="text-xl font-bold ml-4">Device Health</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white rounded-full px-4 py-2 mb-4 border border-gray-300">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search by vehicle name or device..."
          className="flex-1 ml-2"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Summary Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-white rounded-lg p-3 flex-1 mr-2">
          <Text className="text-2xl font-bold text-green-600">{devices.filter(d => d.status === 'healthy').length}</Text>
          <Text className="text-gray-600 text-sm">Healthy</Text>
        </View>
        <View className="bg-white rounded-lg p-3 flex-1 mr-2">
          <Text className="text-2xl font-bold text-blue-600">{devices.filter(d => d.status === 'good').length}</Text>
          <Text className="text-gray-600 text-sm">Good</Text>
        </View>
        <View className="bg-white rounded-lg p-3 flex-1">
          <Text className="text-2xl font-bold text-red-600">{devices.filter(d => d.status === 'bad').length}</Text>
          <Text className="text-gray-600 text-sm">Needs Attention</Text>
        </View>
      </View>

      {/* Device List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredDevices.length > 0 ? (
          filteredDevices.map(renderDeviceCard)
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="search" size={48} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4">No devices found</Text>
            <Text className="text-gray-400 text-center mt-2">
              Try adjusting your search terms
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
