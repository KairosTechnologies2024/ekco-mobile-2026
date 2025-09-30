import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import TicketTypeModal from '../../../components/TicketTypeModal';

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

const ticketTypes = [
  'App Login Issues',
  'Vehicle Not Tracking',
  'Payment Query',
  'Feature Request',
  'Technical Support',
  'Account Management',
  'Other'
];

export default function LogTicket() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(ticketTypes[0]);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newTicket: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      type,
      description: description.trim(),
      customerName: 'Nhlamulo',
      customerEmail: 'nhlamulo@email.com',
      customerPhone: '123-456-7890',
      loggedBy: 'Nhlamulo Mobile App'
    };

    console.log('Submitting ticket:', newTicket);

    Alert.alert('Success', 'Your support ticket has been logged successfully!', [
      { text: 'OK', onPress: () => {
        setTitle('');
        setDescription('');
        setType(ticketTypes[0]);
      }}
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="items-center my-6">
          <MaterialIcons name="headset" size={64} color="#000" style={{marginBottom: 8}} />
          <Text className="text-lg font-semibold text-center">Log Support Ticket</Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Ticket Type</Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <Text className="text-base">{type}</Text>
          </Pressable>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold mb-2">Title</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            placeholder="Brief title for your issue"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base h-80"
            placeholder="Detailed description of your issue or request"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          className="bg-blue-500 py-3 rounded-lg items-center mb-8"
        >
          <Text className="text-white font-semibold text-lg">Submit Ticket</Text>
        </Pressable>

        <TicketTypeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedType={type}
          onSelectType={setType}
          ticketTypes={ticketTypes}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
