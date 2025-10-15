import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
  const [selectedCar, setSelectedCar] = useState(storeVehicles[0]?.id ?? dummyCars[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Map Redux vehicles to the simple shape used in this screen
  const vehiclesList = (Array.isArray(storeVehicles) && storeVehicles.length > 0)
    ? storeVehicles.map((v: any) => ({ 
        id: v.id?.toString?.() ?? v.id, 
        name: v.name ?? `Vehicle ${v.id}`,
        serial: v.serial 
      }))
    : dummyCars;

  // find selected vehicle object from store vehicles
  const selectedVehicle = (Array.isArray(storeVehicles) && storeVehicles.length > 0)
    ? storeVehicles.find((v: any) => (v.id?.toString?.() ?? v.id) === selectedCar)
    : null;

  const serial = selectedVehicle?.serial ?? null;
  
  // Use polling for real-time updates in addition to WebSocket cache invalidation
  const { data: alertsData, isLoading, error, refetch } = useGetAlertsBySerialQuery(serial, {
    skip: !serial,
    pollingInterval: 30000, // Poll every 30 seconds as backup to WebSocket
  });

  // Auto-select first vehicle if none selected and vehicles are available
  useEffect(() => {
    if (vehiclesList.length > 0 && !selectedCar) {
      setSelectedCar(vehiclesList[0].id);
    }
  }, [vehiclesList.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log('Error refreshing alerts:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
    : dummyAlerts.filter(alert => alert.carId === selectedCar).slice(0, 100);

  const selectedCarName = vehiclesList.find(car => car.id === selectedCar)?.name || 'Select Car';

  const getIconName = (alertType: string) => {
    const lc = (alertType ?? '').toString().toLowerCase();
    if (lc.includes('ignition')) return 'key';
    if (lc.includes('door')) return 'lock-open';
    if (lc.includes('jamming') || lc.includes('remote jamming')) return 'radio';
    if (lc.includes('smash') || lc.includes('grab')) return 'shield';
    if (lc.includes('battery') || lc.includes('disconnected')) return 'battery-half';
    return 'alert-circle';
  };

  // Calculate critical alerts count for the badge
  const criticalCount = filteredAlerts.filter((alert: any) => {
    const lcTitle = (alert.type ?? '').toLowerCase();
    return lcTitle.endsWith('detected') || lcTitle.endsWith('disconnected') || 
           lcTitle.includes('disconnected') || lcTitle.includes('smash') || 
           lcTitle.includes('jamming');
  }).length;

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView 
        className="flex-1 p-4 bg-white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#182f51']}
            tintColor={'#182f51'}
          />
        }
      >
        {/* Vehicle Selector */}
        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          className="mb-4 px-4 py-2 border border-gray-300 rounded bg-gray-100 flex-row justify-between items-center"
        >
          <Text className="font-medium">{selectedCarName}</Text>
          <View className="flex-row items-center">
            {criticalCount > 0 && (
              <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">{criticalCount}</Text>
              </View>
            )}
            <Text>▼</Text>
          </View>
        </TouchableOpacity>
        
        {dropdownOpen && (
          <View className="mb-4 border border-gray-300 rounded bg-white shadow-sm">
            {vehiclesList.map(car => (
              <TouchableOpacity
                key={car.id}
                onPress={() => {
                  setSelectedCar(car.id);
                  setDropdownOpen(false);
                }}
                className="px-4 py-3 border-b border-gray-200 flex-row justify-between items-center"
              >
                <Text className="font-medium">{car.name}</Text>
                <Text className="text-xs text-gray-500">{car.serial ? 'Live' : 'Demo'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Alerts List */}
        {isLoading ? (
          <View className="py-8 items-center">
            <Text className="text-gray-500">Loading alerts...</Text>
          </View>
        ) : error ? (
          <View className="py-8 items-center">
            <Text className="text-red-500">Error loading alerts</Text>
            <TouchableOpacity onPress={onRefresh} className="mt-2 px-4 py-2 bg-gray-200 rounded">
              <Text>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert: any) => {
            const rawType = alert.type ?? alert.alert ?? alert.alertType ?? '';
            const title = String(rawType ?? '');
            const message = alert.message ?? alert.alertMessage ?? alert.alert ?? '';
            const ts = alert.timestamp ?? alert.time ?? '';

            const lcTitle = title.toLowerCase();
            const isCritical = lcTitle.endsWith('detected') || lcTitle.endsWith('disconnected') || 
                              lcTitle.includes('disconnected') || lcTitle.includes('smash') || 
                              lcTitle.includes('jamming');

            return (
              <View 
                key={alert.id ?? `${alert.device_serial}-${ts}`} 
                className={`mb-3 p-4 border rounded flex-row items-center ${
                  isCritical 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <Ionicons
                  name={getIconName(title)}
                  size={22}
                  color={isCritical ? '#DC2626' : '#4B5563'}
                  style={{ marginRight: 12 }}
                />
                <View className="flex-1">
                  <Text className={`font-semibold text-base ${
                    isCritical ? 'text-red-600' : 'text-gray-800'
                  }`}>
                    {title}
                  </Text>
                  <Text className="text-gray-600 mt-1">{message}</Text>
                  <Text className="text-xs text-gray-500 mt-2">{ts}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View className="py-8 items-center">
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text className="text-gray-500 mt-2 text-lg">No alerts</Text>
            <Text className="text-gray-400 text-center mt-1">
              {serial ? 'No alerts found for this vehicle' : 'Select a vehicle with a serial number to view live alerts'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}