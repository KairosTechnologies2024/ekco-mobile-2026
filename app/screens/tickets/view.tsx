import { useDeleteTicketMutation, useGetUserTicketsQuery } from '@/store/api/authApi';

import { RootState } from '@/store/store';

import { Alert } from 'react-native';


import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';



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
  const [deleteTicket] = useDeleteTicketMutation();
   const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const { user, customer } = useSelector((state: RootState) => state.user);
 const { data: tickets, isLoading, error, refetch } = useGetUserTicketsQuery({
  userId: user?.id,
  customerId: customer?.user?.id
}, {
  refetchOnMountOrArgChange: true
});


const filteredTickets = (tickets?.tickets || tickets || []).filter(ticket => {
  if (filter === 'all') return true;
  if (filter === 'unresolved') return ticket.status === 'unresolved' || ticket.status === 'pending';
  return ticket.status === filter;
});
//console.log('Tickets data:', tickets);


const handleDeleteTicket = async (ticketId: string) => {
  try {
    console.log('Deleting ticket with ID:', ticketId);
    console.log('User ID:', user?.id);
    await deleteTicket({ userId: user?.id, ticketId }).unwrap();
    Alert.alert('Success', 'Ticket deleted successfully');
    refetch(); // Refetch the tickets list
  } catch (error) {
    Alert.alert('Failed to delete ticket', error?.message || 'An unknown error occurred');
  }
};


  const renderTicket = ({ item }: { item: Ticket }) => (
  <View className="bg-gray-100 rounded-lg p-4 mb-4">
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <View className="flex-row items-center mb-2">
          {item.status === 'resolved' && <Text className="text-green-500 mr-2">✓</Text>}
          {item.status === 'unresolved' && <Text className="text-red-500 mr-2">✗</Text>}
          {item.status === 'pending' && <Text className="text-yellow-500 mr-2">⏱</Text>}
          <Text className="text-lg font-semibold">{item.title}</Text>
        </View>
        <Text className="text-sm text-gray-600">Type: {item.type}</Text>
        <Text className="text-sm text-gray-600">Status: {item.status}</Text>
        <Text className="text-sm text-gray-600">Created: {item.createdat}</Text>
        <Text className="text-sm text-gray-600">Customer: {item.first_name} {item.last_name}</Text>
        <Text className="mt-2">{item.description}</Text>
      </View>
      <Pressable 
        onPress={() => handleDeleteTicket(item.id)}
        className="p-2"
      >
        <Text className="text-red-500">🗑</Text>
      </Pressable>
    </View>
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
{isLoading ? (
  <Text className="text-center text-gray-500">Loading tickets...</Text>
) : error ? (
  <Text className="text-center text-red-500">Error loading tickets. Please try again.</Text>
) : (
  <FlatList
    data={filteredTickets}
    keyExtractor={(item) => item.id}
    renderItem={renderTicket}
    ListEmptyComponent={<Text className="text-center text-gray-500">No tickets found.</Text>}
  />
)}
      </View>
    </SafeAreaView>
  );
}
