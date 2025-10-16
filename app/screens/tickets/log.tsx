import { useCreateTicketMutation } from '@/store/api/authApi';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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


  const dispatch = useDispatch();
const { user, customer } = useSelector((state: RootState) => state.user);
const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState(ticketTypes[0]);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
  if (!title.trim() || !description.trim()) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  try {
    const newTicket = {
      title: title.trim(),
      type,
      description: description.trim(),
      status: "unresolved",
      customerName: `${customer?.user?.first_name} ${customer?.user?.last_name}` ,
      customerEmail: customer?.user?.email ,
      customerPhone: customer?.user?.phone_number ,
      loggedBy: `${customer?.user?.first_name} ${customer?.user?.last_name}`
    };

    await createTicket({
      userId: user?.id,
      customerId: customer?.user?.id,
      ticket: newTicket
    }).unwrap();

    Alert.alert('Success', 'Your support ticket has been logged successfully!', [
      { text: 'OK', onPress: () => {
        setTitle('');
        setDescription('');
        setType(ticketTypes[0]);
      }}
    ]);
  } catch (error) {
    Alert.alert('Error', 'Failed to create ticket. Please try again.');
  }
};
console.log("customer", customer);

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
  disabled={isLoading}
>
  <Text className="text-white font-semibold text-lg">
    {isLoading ? 'Submitting...' : 'Submit Ticket'}
  </Text>
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
