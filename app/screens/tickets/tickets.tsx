import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

export default function TicketsMenu() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
     

      <View className="flex-1 px-4">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => router.push('/screens/tickets/view')}
            className="bg-blue-500 rounded-lg items-center justify-center mb-4"
            style={{ width: '48%', paddingVertical: 20 }}
          >
            <MaterialIcons name="list" size={32} color="white" style={{ marginBottom: 8 }} />
            <Text className="text-white font-semibold text-lg text-center">View All Tickets</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/screens/tickets/log')}
            className="bg-green-500 rounded-lg items-center justify-center mb-4"
            style={{ width: '48%', paddingVertical: 20 }}
          >
            <MaterialIcons name="add" size={32} color="white" style={{ marginBottom: 8 }} />
            <Text className="text-white font-semibold text-lg text-center">Log New Ticket</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/screens/tickets/chat')}
            className="bg-purple-500 rounded-lg items-center justify-center mb-4"
            style={{ width: '48%', paddingVertical: 20 }}
          >
            <MaterialIcons name="chat" size={32} color="white" style={{ marginBottom: 8 }} />
            <Text className="text-white font-semibold text-lg">Chat</Text>
            <Text className="text-white text-sm text-center">Live chat with control room</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
