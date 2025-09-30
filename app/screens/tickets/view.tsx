import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';

interface Ticket {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  loggedBy: string;
}

// Generate 50 mock tickets
const generateMockTickets = (): Ticket[] => {
  const tickets: Ticket[] = [];
  const types = [
    'App Login Issues',
    'Vehicle Not Tracking',
    'Payment Query',
    'Feature Request',
    'Technical Support',
    'Account Management',
    'Other'
  ];
  for (let i = 1; i <= 50; i++) {
    tickets.push({
      id: i.toString(),
      title: `Mock Ticket #${i}`,
      type: types[i % types.length],
      description: `This is a detailed description for mock ticket number ${i}.`,
      status: i % 3 === 0 ? 'resolved' : 'unresolved',
      createdAt: '2023-10-01',
      updatedAt: '2023-10-01',
      customerName: 'Nhlamulo',
      customerEmail: 'nhlamulo@email.com',
      customerPhone: '123-456-7890',
      loggedBy: 'Nhlamulo Mobile App'
    });
  }
  return tickets;
};

export default function ViewTickets() {
  const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [tickets, setTickets] = useState<Ticket[]>(generateMockTickets());

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const renderTicket = ({ item }: { item: Ticket }) => (
    <View className="bg-gray-100 rounded-lg p-4 mb-4">
      <Text className="text-lg font-semibold">{item.title}</Text>
      <Text className="text-sm text-gray-600">Type: {item.type}</Text>
      <Text className="text-sm text-gray-600">Status: {item.status}</Text>
      <Text className="text-sm text-gray-600">Created: {item.createdAt}</Text>
      <Text className="mt-2">{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4">
        <View className="flex-row mb-4">
          <Pressable
            onPress={() => setFilter('all')}
            className={`flex-1 py-4 rounded-l-lg items-center ${filter === 'all' ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <Text className={filter === 'all' ? 'text-white' : 'text-black'}>All</Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter('resolved')}
            className={`flex-1 py-4 items-center ${filter === 'resolved' ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <Text className={filter === 'resolved' ? 'text-white' : 'text-black'}>Resolved</Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter('unresolved')}
            className={`flex-1 py-4 rounded-r-lg items-center ${filter === 'unresolved' ? 'bg-red-500' : 'bg-gray-300'}`}
          >
            <Text className={filter === 'unresolved' ? 'text-white' : 'text-black'}>Unresolved</Text>
          </Pressable>
        </View>

        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          ListEmptyComponent={<Text className="text-center text-gray-500">No tickets found.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}
