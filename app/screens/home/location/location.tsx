import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const { vehicle } = useLocalSearchParams();
  let vehicleData;
  try {
    vehicleData = vehicle ? JSON.parse(vehicle as string) : { name: 'Unknown Vehicle', status: 'Unknown', location: 'Unknown Location' };
  } catch (error) {
    console.error('Error parsing vehicle data:', error);
    vehicleData = { name: 'Unknown Vehicle', status: 'Unknown', location: 'Unknown Location' };
  }

  const [address, setAddress] = useState<string>('');


  const vehicleLat = 37.78825; 
  const vehicleLng = -122.4324;


  const routeCoordinates = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.79025, longitude: -122.4344 },
    { latitude: 37.79225, longitude: -122.4364 },
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
            title={vehicleData.name}
            description={vehicleData.status}
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
            {vehicleData.status === 'Moving' ? '🚗 Moving' : '🅿️ Parked'}
          </Text>
        </View>
      </View>

      {/* Bottom Details */}
      <View style={{ paddingBottom: insets.bottom }} className="bg-primary-background-color text-white   p-4  rounded-t-lg shadow-lg flex-col justify-center">
        <View className="flex-row items-center mb-4 h-16 ">
          <Ionicons name="car" size={40} color="#fff" />
          <View className="ml-4 ">
            <Text className="text-lg font-bold text-white">{vehicleData.name}</Text>
            <Text className="text-white">{vehicleData.location}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-white">Ignition: On</Text>
          <Text className="text-sm text-white">Speed: 45 km/h</Text>
          
        </View>


 <View className="flex-row justify-between items-center mb-6">

        <Text className="text-sm text-white">Vehicle Registration: ABC-123</Text>
        <Text className="text-sm text-white">Battery: Disconnected</Text>
</View>



        <Pressable
          onPress={getAddress}
          className="bg-accent-color p-3 rounded-lg"
        >
          <Text className="text-white text-center font-bold mb-2">Get Address</Text>
        </Pressable>

        {address ? (
          <Text className="text-sm mt-2 text-white " >{address}</Text>
        ) : null}
      </View>
     
    </>
  );
}
