import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useSelector } from 'react-redux';
import { useGetAlertsBySerialQuery } from '../../store/api/authApi';
import { RootState } from '../../store/store';

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



export const dummyAlerts = generateDummyAlerts();

export default function Alerts() {
  const storeVehicles = useSelector((state: RootState) => state.user.vehicles) ?? [];
  // Map Redux vehicles to the simple shape used in this screen
  const vehiclesList = (Array.isArray(storeVehicles) && storeVehicles.length > 0)
    ? storeVehicles.map((v: any) => ({ id: v.id?.toString?.() ?? v.id, name: v.name ?? `Vehicle ${v.id}` }))
    : dummyCars;

  const [selectedCar, setSelectedCar] = useState(vehiclesList[0]?.id ?? dummyCars[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // find selected vehicle object from store vehicles
  const selectedVehicle = (Array.isArray(storeVehicles) && storeVehicles.length > 0)
    ? storeVehicles.find((v: any) => (v.id?.toString?.() ?? v.id) === selectedCar)
    : null;

  const serial = selectedVehicle?.serial ?? null;
  const { data: alertsData, isLoading, error } = useGetAlertsBySerialQuery(serial, {
    skip: !serial,
  });

  // Extract alerts from RTK Query response
  const alerts = alertsData ? (alertsData.alerts ?? alertsData.data ?? (Array.isArray(alertsData) ? alertsData : [])) : null;

  // Log alerts object when available
  useEffect(() => {
    if (alerts) {
      console.log('Alerts object:', alerts);
    }
  }, [alerts]);

  // Normalize alerts into a consistent shape for the UI
  const normalizedAlerts = (alerts && Array.isArray(alerts)) ? alerts.map((a: any, idx: number) => {
    const rawType = a.alert ?? a.alertType ?? '';
    const type = typeof rawType === 'string' ? rawType : String(rawType);
    const message = a.alertMessage ?? a.message ?? a.alert ?? '';
    const timeStr = a.time ?? a.timestamp ?? a.timeStamp ?? null;
    let timestamp = '';
    let timeNum = 0;
    if (timeStr) {
      try {
        // time may be a unix seconds string
        const tnum = parseInt(timeStr.toString(), 10);
        if (!Number.isNaN(tnum)) {
          timeNum = tnum;
          timestamp = new Date(tnum * 1000).toLocaleString();
        } else {
          timestamp = String(timeStr);
        }
      } catch (e) {
        timestamp = String(timeStr);
      }
    }
    return {
      id: a.id ?? `${a.device_serial ?? 'unknown'}-${timeStr ?? idx}`,
      type,
      message,
      timestamp,
      device_serial: a.device_serial ?? a.serial ?? null,
      timeNum,
    };
  }) : null;

  // Sort normalized alerts newest-first and limit to top 100
  const filteredAlerts = normalizedAlerts
    ? normalizedAlerts.sort((a: any, b: any) => (b.timeNum || 0) - (a.timeNum || 0)).slice(0, 100)
    : dummyAlerts.filter(alert => alert.carId === selectedCar).slice(0, 100)
  const selectedCarName = vehiclesList.find(car => car.id === selectedCar)?.name || 'Select Car'

  const getIconName = (alertType: string) => {
    const lc = (alertType ?? '').toString().toLowerCase();
    if (lc.includes('ignition')) return 'key';
    if (lc.includes('door')) return 'lock-open';
    if (lc.includes('jamming') || lc.includes('remote jamming')) return 'radio';
    if (lc.includes('smash') || lc.includes('grab')) return 'shield';
    if (lc.includes('battery') || lc.includes('disconnected')) return 'battery-half';
    return 'alert-circle';
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
            {vehiclesList.map(car => (
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
          filteredAlerts.map((alert: any) => {
            // support multiple shapes: normalized {type,message,timestamp} or raw {alert,alertType,alertMessage,time}
            const rawType = alert.type ?? alert.alert ?? alert.alertType ?? '';
            const title = String(rawType ?? '');
            const message = alert.message ?? alert.alertMessage ?? alert.alert ?? '';
            const ts = alert.timestamp ?? alert.time ?? '';

            const lcTitle = title.toLowerCase();
            const isCritical = lcTitle.endsWith('detected') || lcTitle.endsWith('disconnected') || lcTitle.includes('disconnected') || lcTitle.includes('smash') || lcTitle.includes('jamming');

            return (
              <View key={alert.id ?? `${alert.device_serial}-${ts}` } className="mb-3 p-3 border border-gray-300 rounded bg-gray-50 flex-row items-center">
                <Ionicons
                  name={getIconName(title)}
                  size={20}
                  color={isCritical ? 'red' : 'black'}
                  style={{ marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className={`font-semibold ${isCritical ? 'text-red-500' : 'text-black'}`}>{title}</Text>
                  <Text>{message}</Text>
                  <Text className="text-xs text-gray-500">{ts}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text>No alerts for this car.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
