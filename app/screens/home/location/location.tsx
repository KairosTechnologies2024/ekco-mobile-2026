import { useGetGpsBySerialQuery, useGetVehicleIgnitionQuery, useGetVehicleSpeedQuery } from '@/store/api/authApi';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { vehicle } = useLocalSearchParams();
  
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

  // Get vehicles from Redux store (this gets updated by the centralized WebSocket)
  const vehicles = useSelector((state: RootState) => state.user.vehicles);
  const selectedVehicle = vehicles?.find((v: any) => v.id === vehicleData.id);

  // Fetch speed, ignition, and GPS from API using vehicle serial
  const { data: speedData, error: speedError, isLoading: speedLoading } = useGetVehicleSpeedQuery(
    selectedVehicle?.serial || '',
    { skip: !selectedVehicle?.serial }
  );
  const { data: ignitionData, error: ignitionError, isLoading: ignitionLoading } = useGetVehicleIgnitionQuery(
    selectedVehicle?.serial || '',
    { skip: !selectedVehicle?.serial }
  );
  const { data: gpsData, error: gpsError, isLoading: gpsLoading } = useGetGpsBySerialQuery(
    selectedVehicle?.serial || '',
    { skip: !selectedVehicle?.serial }
  );

  // Log API data for debugging
  console.log('Speed data from API:', speedData, 'error:', speedError, 'loading:', speedLoading);
  console.log('Ignition data from API:', ignitionData, 'error:', ignitionError, 'loading:', ignitionLoading);
  console.log('GPS data from API:', gpsData, 'error:', gpsError, 'loading:', gpsLoading);

  const [address, setAddress] = useState<string>('');

  // Use the latest speed from API data array, fallback to Redux store (updated by WebSocket)
  const speed = speedData?.speed_data?.[0]?.speed ?? (selectedVehicle as any)?.latestSpeed ?? 0;

  // Use the latest ignition from API data array, fallback to WebSocket
  const ignition = ignitionData?.ignition_data?.[0]?.ignition_status ?? (selectedVehicle as any)?.ignitionStatus ?? 'Off';


  // Log derived values
  console.log('Derived speed:', speedData);
  console.log('Derived ignition:', ignitionData);

  // Derive status from speed
  const derivedStatus = speed > 0 ? 'Moving' : 'Parked';

  // Use latest GPS coordinates from API, fallback to Redux store
  const vehicleLat = gpsData?.gps_data?.[0]?.latitude ?? (selectedVehicle as any)?.latitude ?? 37.78825;
  const vehicleLng = gpsData?.gps_data?.[0]?.longitude ?? (selectedVehicle as any)?.longitude ?? -122.4324;

  const routeCoordinates = [
    { latitude: vehicleLat, longitude: vehicleLng },
    { latitude: vehicleLat + 0.002, longitude: vehicleLng + 0.002 },
    { latitude: vehicleLat + 0.004, longitude: vehicleLng + 0.004 },
  ];

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
 console.log('selected vehicle is', selectedVehicle)
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
        >
          <Marker
            coordinate={{ latitude: vehicleLat, longitude: vehicleLng }}
            title={selectedVehicle?.name || vehicleData.name}
            description={derivedStatus}
          />
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>

        {/* Sticker on top of map */}
        <View className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-md">
          <Text className="text-sm font-bold">
            {derivedStatus === 'Moving' ? '🚗 Moving' : '🅿️ Parked'}
          </Text>
        </View>
      </View>

      {/* Bottom Details */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-primary-background-color text-white p-4 rounded-t-lg shadow-lg flex-col justify-center">
        <View className="flex-row items-center mb-4 h-16">
          <Ionicons name="car" size={40} color="#fff" />
          <View className="ml-4">
            <Text className="text-lg font-bold text-white">{selectedVehicle?.name || vehicleData.name}</Text>
            <Text className="text-white">
              {selectedVehicle?.location && selectedVehicle.location !== 'Unknown'
                ? selectedVehicle.location
                : (vehicleLat !== 37.78825 && vehicleLng !== -122.4324
                  ? `${Number(vehicleLat).toFixed(5)}, ${Number(vehicleLng).toFixed(5)}`
                  : vehicleData.location)}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-white">Ignition: {ignition}</Text>
          <Text className="text-sm text-white">Speed: {speed} km/h</Text>
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm text-white">Vehicle Registration: {(selectedVehicle as any)?.plate || 'ABC-123'}</Text>
          <Text className="text-sm text-white">Battery: Disconnected</Text>
        </View>

        <Pressable
          onPress={getAddress}
          className="bg-accent-color p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold mb-2">Get Address</Text>
        </Pressable>

        {address ? (
          <Text className="text-sm mt-2 text-white">{address}</Text>
        ) : null}
      </View>
    </>
  );
}