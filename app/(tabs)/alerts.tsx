import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const dummyCars = [
  { id: 'car1', name: 'BMW 2020 X3' },
  { id: 'car2', name: 'Audi 2019 A4' },
  { id: 'car3', name: 'Mazda 2021 CX-5' },
]

const generateDummyAlerts = () => {
  const alerts = [];
  const types = ['Ignition On', 'Door Open', 'Remote Jamming Detected', 'Smash and Grab Detected', 'Car Battery Disconnected'];
  for (let i = 0; i < 100; i++) {
    const car = dummyCars[i % dummyCars.length];
    const type = types[i % types.length];
    const date = new Date(2024, 5, 1 + Math.floor(i / 10)); 
    const hour = 8 + (i % 12);
    const minute = (i % 60);
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    alerts.push({
      id: (i + 1).toString(),
      carId: car.id,
      alertType: type,
      alertMessage: `${type} for ${car.name} (${car.id.toUpperCase()}-${(i % 1000).toString().padStart(3, '0')})`,
      timestamp: `${date.toISOString().split('T')[0]} ${time}`,
    });
  }
  return alerts;
};



const endsWithWords= 'Detected' || 'Disconnected';
export const dummyAlerts = generateDummyAlerts();

export default function Alerts() {
  const [selectedCar, setSelectedCar] = useState(dummyCars[0].id)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredAlerts = dummyAlerts.filter(alert => alert.carId === selectedCar)
  const selectedCarName = dummyCars.find(car => car.id === selectedCar)?.name || 'Select Car'

  const getIconName = (alertType: string) => {
    switch (alertType) {
      case 'Ignition On': return 'key';
      case 'Door Open': return 'lock-open';
      case 'Remote Jamming Detected': return 'radio';
      case 'Smash and Grab Detected': return 'shield';
      case 'Car Battery Disconnected': return 'battery-half';
      default: return 'alert-circle';
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1 p-4 bg-white">
  
        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded bg-gray-100"
        >
          <Text>{selectedCarName} ▼</Text>
        </TouchableOpacity>
        {dropdownOpen && (
          <View className="mb-4 border border-gray-300 rounded bg-white">
            {dummyCars.map(car => (
              <TouchableOpacity
                key={car.id}
                onPress={() => {
                  setSelectedCar(car.id)
                  setDropdownOpen(false)
                }}
                className="px-4 py-2 border-b border-gray-200"
              >
                <Text>{car.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

    
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
          <View key={alert.id} className="mb-3 p-3 border border-gray-300 rounded bg-gray-50 flex-row items-center">
            <Ionicons
              name={getIconName(alert.alertType)}
              size={20}
              color={alert.alertType.endsWith('Detected') ? 'red' : 'black'}
              style={{ marginRight: 12 }}
            />
            <View className="flex-1">
              <Text className={`font-semibold ${alert.alertType.endsWith(endsWithWords) ? 'text-red-500' : 'text-black'}`}>{alert.alertType}</Text>
              <Text>{alert.alertMessage}</Text>
              <Text className="text-xs text-gray-500">{alert.timestamp}</Text>
            </View>
          </View>
          ))
        ) : (
          <Text>No alerts for this car.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
