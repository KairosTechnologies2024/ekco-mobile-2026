import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

interface TicketTypeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  ticketTypes: string[];
}

export default function TicketTypeModal({
  visible,
  onClose,
  selectedType,
  onSelectType,
  ticketTypes,
}: TicketTypeModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg w-3/4 max-h-96 p-4">
          <Text className="text-lg font-semibold mb-4">Select Ticket Type</Text>
          <ScrollView>
            {ticketTypes.map((ticketType) => (
              <Pressable
                key={ticketType}
                onPress={() => {
                  onSelectType(ticketType);
                  onClose();
                }}
                className="py-2 border-b border-gray-200"
              >
                <Text className="text-base">{ticketType}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            onPress={onClose}
            className="mt-4 bg-gray-300 rounded-lg py-2 items-center"
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
