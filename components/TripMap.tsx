import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

interface Trip {
  id: number;
  vehicle: string;
  startAddress: string;
  endAddress: string;
  coordinates: {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
  };
}

interface TripMapProps {
  trip: Trip;
  height?: number;
}

export default function TripMap({ trip, height }: TripMapProps) {
  // Calculate the center point between start and end coordinates
  const centerLatitude = (trip.coordinates.start.latitude + trip.coordinates.end.latitude) / 2;
  const centerLongitude = (trip.coordinates.start.longitude + trip.coordinates.end.longitude) / 2;

  // Calculate the delta for the map region
  const latDelta = Math.abs(trip.coordinates.start.latitude - trip.coordinates.end.latitude) * 1.5;
  const lonDelta = Math.abs(trip.coordinates.start.longitude - trip.coordinates.end.longitude) * 1.5;

  const region = {
    latitude: centerLatitude,
    longitude: centerLongitude,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum delta to ensure visibility
    longitudeDelta: Math.max(lonDelta, 0.01),
  };

  
  const routeCoordinates = [
    trip.coordinates.start,
    trip.coordinates.end
  ];

  return (
    <View className="flex-1 w-full h-full">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: '100%', height: '100%' }}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {/* Start Marker */}
        <Marker
          coordinate={trip.coordinates.start}
          title="Start Location"
          description={trip.startAddress}
          pinColor="green"
        >
          <View className="bg-green-500 rounded-full p-2">
            <Text className="text-white font-bold text-xs">S</Text>
          </View>
        </Marker>

        {/* End Marker */}
        <Marker
          coordinate={trip.coordinates.end}
          title="End Location"
          description={trip.endAddress}
          pinColor="red"
        >
          <View className="bg-red-500 rounded-full p-2">
            <Text className="text-white font-bold text-xs">E</Text>
          </View>
        </Marker>

        {/* Route Line */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#3b82f6"
          strokeWidth={4}
          lineDashPattern={[10, 10]}
        />
      </MapView>

      {/* Trip Info Overlay */}
      <View className="absolute top-4 left-4 right-4 bg-white rounded-lg p-3 shadow-lg">
        <Text className="font-bold text-gray-900 mb-1">{trip.vehicle}</Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-600">Route: </Text>
          <Text className="text-sm text-gray-900 flex-1" numberOfLines={1}>
            {trip.startAddress.split(',')[0]} → {trip.endAddress.split(',')[0]}
          </Text>
        </View>
      </View>
    </View>
  );
}
