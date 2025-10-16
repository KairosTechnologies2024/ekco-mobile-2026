import { useGetGpsBySerialQuery, useGetVehicleIgnitionQuery, useGetVehicleSpeedQuery } from '@/store/api/authApi';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { vehicle } = useLocalSearchParams();
  const [address, setAddress] = useState<string>('');
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  
  let vehicleData;
  try {
    vehicleData = vehicle ? JSON.parse(vehicle as string) : { 
      name: 'Unknown Vehicle', 
      status: 'Unknown', 
      location: 'Unknown Location' 
    };
  } catch (error) {
    console.error('Error parsing vehicle data:', error);
    vehicleData = { 
      name: 'Unknown Vehicle', 
      status: 'Unknown', 
      location: 'Unknown Location' 
    };
  }

  // Get vehicles from Redux store (updated by WebSocket)
  const vehicles = useSelector((state: RootState) => state.user.vehicles);
  const selectedVehicle = vehicles?.find((v: any) => v.id === vehicleData.id);

  // API queries with reduced polling since we have WebSocket updates
  const { data: speedData } = useGetVehicleSpeedQuery(
    selectedVehicle?.serial || '',
    { 
      skip: !selectedVehicle?.serial,
      pollingInterval: 5000 // Poll every 5 seconds as backup
    }
  );
  
  const { data: ignitionData } = useGetVehicleIgnitionQuery(
    selectedVehicle?.serial || '',
    { 
      skip: !selectedVehicle?.serial,
      pollingInterval: 5000 // Poll every 5 seconds as backup
    }
  );

  const { data: gpsData } = useGetGpsBySerialQuery(
    selectedVehicle?.serial || '',
    { 
      skip: !selectedVehicle?.serial,
      pollingInterval: 5000 // Poll every 5 seconds as backup
    }
  );

  // Update route coordinates when GPS data changes
  useEffect(() => {
    const newLat = gpsData?.gps_data?.[0]?.latitude ?? (selectedVehicle as any)?.latitude ?? 37.78825;
    const newLng = gpsData?.gps_data?.[0]?.longitude ?? (selectedVehicle as any)?.longitude ?? -122.4324;
    
    setRouteCoordinates(prev => {
      const newCoords = [...prev, { latitude: newLat, longitude: newLng }];
      // Keep only last 10 coordinates for route
      return newCoords.slice(-10);
    });
  }, [gpsData, selectedVehicle?.latitude, selectedVehicle?.longitude]);

  // Get current values with WebSocket data as primary source
  const speed = (selectedVehicle as any)?.latestSpeed ?? speedData?.speed_data?.[0]?.speed ?? 0;
  const ignition = (selectedVehicle as any)?.ignitionStatus ?? ignitionData?.ignition_data?.[0]?.ignition_status ?? 'Off';
  const derivedStatus = speed > 0 ? 'Moving' : 'Parked';
  
  const vehicleLat = (selectedVehicle as any)?.latitude ?? gpsData?.gps_data?.[0]?.latitude ?? 37.78825;
  const vehicleLng = (selectedVehicle as any)?.longitude ?? gpsData?.gps_data?.[0]?.longitude ?? -122.4324;

  const getAddress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get address');
        return;
      }

      const result = await Location.reverseGeocodeAsync({
        latitude: vehicleLat,
        longitude: vehicleLng,
      });
      if (result.length > 0) {
        const addr = result[0];
        setAddress(`${addr.street}, ${addr.city}, ${addr.region}`);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address');
    }
  };

  return (
    <>
      {/* Map Container */}
      <View className="flex-1 relative">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: vehicleLat,
            longitude: vehicleLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          followsUserLocation
          showsUserLocation
        >
          <Marker
  coordinate={{ latitude: vehicleLat, longitude: vehicleLng }}
  title={selectedVehicle?.name || vehicleData.name}
  description={derivedStatus}
  pinColor={derivedStatus === 'Moving' ? '#3b82f6' : '#ef4444'} // Blue for moving, red for parked
/>
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#000"
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Status Badge */}
        <View className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
          <Text className="text-sm font-bold">
            {derivedStatus === 'Moving' ? '🚗 Moving' : '🅿️ Parked'}
          </Text>
          <Text className="text-xs text-gray-600">
            {speed} km/h
          </Text>
        </View>
      </View>

      {/* Bottom Details */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-primary-background-color text-white p-4 rounded-t-lg shadow-lg">
        <View className="flex-row items-center mb-4">
          <Ionicons name="car" size={40} color="#fff" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-white">{selectedVehicle?.name || vehicleData.name}</Text>
            <Text className="text-white text-sm">
              {selectedVehicle?.location && selectedVehicle.location !== 'Unknown'
                ? selectedVehicle.location
                : (vehicleLat !== 37.78825 && vehicleLng !== -122.4324
                  ? `${Number(vehicleLat).toFixed(5)}, ${Number(vehicleLng).toFixed(5)}`
                  : vehicleData.location)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Ionicons 
              name={ignition === 'On' ? 'flash' : 'flash-off'} 
              size={16} 
              color={ignition === 'On' ? '#10b981' : '#ef4444'} 
            />
            <Text className="text-sm text-white ml-2">Ignition: {ignition}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="speedometer" size={16} color="#fff" />
            <Text className="text-sm text-white ml-2">Speed: {speed} km/h</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm text-white">Vehicle Registration: {(selectedVehicle as any)?.plate || 'ABC-123'}</Text>
          <Text className="text-sm text-white">Battery: Disconnected</Text>
        </View>

        <Pressable
          onPress={getAddress}
          className="bg-accent-color p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Get Address</Text>
        </Pressable>

        {address ? (
          <View className="mt-2 p-2 bg-white/10 rounded-lg">
            <Text className="text-sm text-white">{address}</Text>
          </View>
        ) : null}
      </View>
    </>
  );
}
