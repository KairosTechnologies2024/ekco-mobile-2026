import { useGetAlertsBySerialQuery, useGetGpsBySerialQuery, useGetVehicleIgnitionQuery, useGetVehicleSpeedQuery } from '@/store/api/authApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import WebSocketService from '../../services/WebSocketService';
import { RootState } from '../../store/store';


// Helper function for pin colors
const getPinColor = (speed: number) => {
  if (speed === 0) return '#ef4444'; // Red for parked
  if (speed < 30) return '#f59e0b'; // Amber for slow
  if (speed < 60) return '#3b82f6'; // Blue for normal
  return '#10b981'; // Green for fast
};

export default function Home() {




  const router = useRouter();
  const dispatch = useDispatch();
  const customer = useSelector((state: RootState) => state.user.customer);
  const vehicles = useSelector((state: RootState) => state.user.vehicles);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [vehiclesFullScreen, setVehiclesFullScreen] = useState(false);
  const [deviceHealthModal, setDeviceHealthModal] = useState(false);
  const modalDismissedRef = useRef(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

const [mapRegion, setMapRegion] = useState({
  latitude: -26.2041,
  longitude: 28.0473,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
});

const [lastKnownCoords, setLastKnownCoords] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);


  // Slider data and state
  const sliderData = [
  {
    id: 1,
    title: "Effortlessly keep track of\nall your vehicles",
    backgroundColor: '#000',
    icon: 'location-outline' // Location pin icon
  },
  {
    id: 2,
    title: "Monitor your fleet in\nreal-time",
    backgroundColor: '#182f51',
    icon: 'time-outline' // Clock icon for real-time
  },
  {
    id: 3,
    title: "Stay connected with your\nvehicles 24/7",
    backgroundColor: '#DC2626',
    icon: 'wifi-outline' // WiFi/network icon for connectivity
  },
  {
    id: 4,
    title: "Track location, status, and\nperformance",
    backgroundColor: '#7C3AED',
    icon: 'speedometer-outline' // Speed/performance icon
  }
];

  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDropdownVisible(false);
      });
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleMapFullScreen = () => {
    setMapFullScreen(!mapFullScreen);
  };

  const toggleVehiclesFullScreen = () => {
    setVehiclesFullScreen(!vehiclesFullScreen);
  };

  const handleVehicleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (Math.abs(currentScrollY - lastScrollY) > 10) {
      if (!isScrolling) {
        setIsScrolling(true);
        setVehiclesFullScreen(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 500);
      }
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  useEffect(() => {
    if (!modalDismissedRef.current) {
      setDeviceHealthModal(true);
    }
  });

  useEffect(() => {
    return () => {
      modalDismissedRef.current = false;
    };
  }, []);

  const dummyVehicles = [
    { id: 1, name: 'Toyota Camry', serial: 'CAM001', location: 'Downtown', status: 'Moving' },
    { id: 2, name: 'Honda Civic', serial: 'CIV001', location: 'Suburb', status: 'Parked' },
    { id: 3, name: 'Ford Mustang', serial: 'MUS001', location: 'Highway', status: 'Moving' },
    { id: 4, name: 'Chevrolet Malibu', serial: 'MAL001', location: 'Airport', status: 'Parked' },
    { id: 5, name: 'Nissan Altima', serial: 'ALT001', location: 'Mall', status: 'Moving' },
    { id: 6, name: 'BMW 3 Series', serial: 'BMW001', location: 'Downtown', status: 'Parked' },
    { id: 7, name: 'Audi A4', serial: 'AUD001', location: 'Suburb', status: 'Moving' },
    { id: 8, name: 'Mercedes C-Class', serial: 'MER001', location: 'Highway', status: 'Parked' },
    { id: 9, name: 'Volkswagen Passat', serial: 'VOL001', location: 'Airport', status: 'Moving' },
    { id: 10, name: 'Hyundai Sonata', serial: 'HYU001', location: 'Mall', status: 'Parked' },
  ];

  const displayVehicles = (vehicles && Array.isArray(vehicles) && vehicles.length > 0) ? vehicles : dummyVehicles;
  const isSingleVehicle = displayVehicles.length === 1;

  // For each vehicle, fetch its data
  const vehicleQueries = displayVehicles.map(vehicle => ({
    speed: useGetVehicleSpeedQuery(
      (vehicle as any).serial || '',
      { 
        skip: !(vehicle as any).serial,
        pollingInterval: 5000
      }
    ),
    ignition: useGetVehicleIgnitionQuery(
      (vehicle as any).serial || '',
      { 
        skip: !(vehicle as any).serial,
        pollingInterval: 5000
      }
    ),
    gps: useGetGpsBySerialQuery(
      (vehicle as any).serial || '',
      { 
        skip: !(vehicle as any).serial,
        pollingInterval: 5000
      }
    )
  }));

  const dummyCoords = [
    { latitude: -26.2041, longitude: 28.0473 },
    { latitude: -26.2441, longitude: 28.0873 },
    { latitude: -26.2841, longitude: 28.1273 },
  ];

  useEffect(() => {
    const wsService = WebSocketService.getInstance();
    wsService.connect();
  }, []);



useEffect(() => {
  if (displayVehicles.length > 0) {
    const vehicle = displayVehicles[0];
    const queryIndex = displayVehicles.indexOf(vehicle);
    const queries = vehicleQueries[queryIndex];
    
    const hasLat = queries.gps.data?.gps_data?.[0]?.latitude !== null && queries.gps.data?.gps_data?.[0]?.latitude !== undefined;
    const hasLon = queries.gps.data?.gps_data?.[0]?.longitude !== null && queries.gps.data?.gps_data?.[0]?.longitude !== undefined;
    
    if (hasLat && hasLon) {
      const newLat = Number(queries.gps.data?.gps_data?.[0]?.latitude);
      const newLon = Number(queries.gps.data?.gps_data?.[0]?.longitude);
      
      // Only update if coordinates have actually changed
      if (!lastKnownCoords || 
          lastKnownCoords.latitude !== newLat || 
          lastKnownCoords.longitude !== newLon) {
        
        setLastKnownCoords({ latitude: newLat, longitude: newLon });
        setMapRegion(prev => ({
          ...prev,
          latitude: newLat,
          longitude: newLon,
        }));
      }
    }
  }
}, [displayVehicles[0]?.id, vehicleQueries[0]?.gps.data?.gps_data?.[0]]);
const alertsQueries = displayVehicles.map(vehicle => 
  useGetAlertsBySerialQuery((vehicle as any).serial, {
    skip: !(vehicle as any).serial,
    pollingInterval: 30000,
  })
);

const criticalCount = alertsQueries.reduce((total, query) => {
  const alerts = query.data?.alerts ?? [];
  const criticalAlerts = alerts.filter((alert: any) => {
    const lcTitle = (alert.alert ?? '').toLowerCase();
    return lcTitle.endsWith('detected') || lcTitle.endsWith('disconnected') || 
           lcTitle.includes('disconnected') || lcTitle.includes('smash') || 
           lcTitle.includes('jamming');
  });
  return total + criticalAlerts.length;
}, 0);
  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-row justify-between items-center px-4 py-4">
        <Text className="text-3xl font-bold">
          {getGreeting()}, {'\n'}{customer?.user?.first_name || 'User'} 😁
        </Text>

        <View className="flex-row items-center">
     <Pressable onPress={() => router.push('/alerts')} className="relative mr-4">
  <Ionicons name="notifications-outline" size={32} color="black" />
  {criticalCount > 0 && (
    <View className="absolute top-0 right-0 bg-red-500 rounded-full px-1.5 py-0.5 items-center justify-center">
      <Text className="text-white text-xs font-bold">{criticalCount > 99 ? '99+' : criticalCount}</Text>
    </View>
  )}
</Pressable>
          <Pressable onPress={toggleDropdown} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Image
              source={require('../../assets/images/user.png')}
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
          </Pressable>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={() => {
        if (dropdownVisible) {
          Animated.timing(dropdownAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setDropdownVisible(false);
          });
        }
      }}>
        <View className="flex-1">
        <View
  className='h-32 w-full rounded-2xl px-6 py-6 flex-row items-center mt-4'
  style={{ backgroundColor: sliderData[currentSlide].backgroundColor }}
>
  <View className="flex-1">
    <Text className='text-white text-xl font-bold'>
      {sliderData[currentSlide].title}
    </Text>
  </View>
  <View className="items-center justify-center ml-4">
    <Ionicons 
      name={sliderData[currentSlide].icon}
      size={40} 
      color="rgba(255,255,255,0.8)"
    />
  </View>
</View>
          {!isSingleVehicle && (
            <View className="mt-4">
              <View className="flex-row items-center bg-white rounded-full px-4 border border-gray-400">
                <TextInput
                  placeholder="search vehicle"
                  className="flex-1 ml-2"
                />
                <Ionicons name="search" size={20} color="gray" />
              </View>
            </View>
          )}

          <Text className="text-xl font-bold mt-4 px-4">Your Vehicle(s) Current Position</Text>

    <MapView
  style={mapFullScreen ? { flex: 1 } : isSingleVehicle ? { flex: 1, marginHorizontal: 16, marginTop: 8, borderRadius: 8 } : { height: 192, marginHorizontal: 16, marginTop: 8, borderRadius: 8 }}
  region={mapRegion}
  onRegionChangeComplete={(region) => {
    // Only update if user manually moved the map
    if (!lastKnownCoords || 
        Math.abs(region.latitude - lastKnownCoords.latitude) > 0.001 ||
        Math.abs(region.longitude - lastKnownCoords.longitude) > 0.001) {
      setMapRegion(region);
    }
  }}
  followsUserLocation={isSingleVehicle}
  showsUserLocation={isSingleVehicle}
  onPress={toggleMapFullScreen}
>

            {displayVehicles.slice(0,3).map((vehicle, index) => {
              const queryIndex = displayVehicles.indexOf(vehicle);
              const queries = vehicleQueries[queryIndex];
              
              const speed = queries.speed.data?.speed_data?.[0]?.speed ?? (vehicle as any)?.latestSpeed ?? 0;
              const ignition = queries.ignition.data?.ignition_data?.[0]?.ignition_status ?? (vehicle as any)?.ignitionStatus ?? 'Off';
              const status = speed > 0 ? 'Moving' : 'Parked';
              
              const hasLat = queries.gps.data?.gps_data?.[0]?.latitude !== null && queries.gps.data?.gps_data?.[0]?.latitude !== undefined;
              const hasLon = queries.gps.data?.gps_data?.[0]?.longitude !== null && queries.gps.data?.gps_data?.[0]?.longitude !== undefined;
              const coords = hasLat && hasLon
                ? { 
                    latitude: Number(queries.gps.data?.gps_data?.[0]?.latitude), 
                    longitude: Number(queries.gps.data?.gps_data?.[0]?.longitude)
                  }
                : dummyCoords[index % dummyCoords.length];
              
              return (
                <Marker
                  key={vehicle.id}
                  coordinate={coords}
                  title={vehicle.name}
                  description={`${status} - ${speed} km/h`}
                  pinColor={getPinColor(speed)}
                />
              );
            })}
          </MapView>

        <Pressable onPress={() => isSingleVehicle ? {} : toggleVehiclesFullScreen()} style={vehiclesFullScreen ? { flex: 1 } : isSingleVehicle ? {} : { maxHeight: 300 }}>
       <ScrollView
  className="mt-4"
  style={vehiclesFullScreen ? { flex: 1 } : isSingleVehicle ? { height: 'auto' } : { maxHeight: 300 }}
  scrollEnabled={!isSingleVehicle}
  onScroll={handleVehicleScroll}
  scrollEventThrottle={16}
>
              {displayVehicles.map((vehicle) => {
                const queryIndex = displayVehicles.indexOf(vehicle);
                const queries = vehicleQueries[queryIndex];
                
                const speed = queries.speed.data?.speed_data?.[0]?.speed ?? (vehicle as any)?.latestSpeed ?? 0;
                const ignition = queries.ignition.data?.ignition_data?.[0]?.ignition_status ?? (vehicle as any)?.ignitionStatus ?? 'Off';
                const status = speed > 0 ? 'Moving' : 'Parked';
                
                const hasLat = queries.gps.data?.gps_data?.[0]?.latitude !== null && queries.gps.data?.gps_data?.[0]?.latitude !== undefined;
                const hasLon = queries.gps.data?.gps_data?.[0]?.longitude !== null && queries.gps.data?.gps_data?.[0]?.longitude !== undefined;
                const coordText = hasLat && hasLon 
                  ? `${Number(queries.gps.data?.gps_data?.[0]?.latitude).toFixed(5)}, ${Number(queries.gps.data?.gps_data?.[0]?.longitude).toFixed(5)}`
                  : null;
                const locText = vehicle.location && vehicle.location !== 'Unknown' 
                  ? vehicle.location 
                  : (coordText ?? 'Unknown');

                return (
                  <Pressable
                    key={vehicle.id}
                    onPress={() => {
                      router.push({
                        pathname: '/screens/home/location/location',
                        params: { vehicle: JSON.stringify(vehicle) },
                      });
                    }}
                    className="bg-white rounded-lg p-4 m-2 shadow-md flex-row items-center"
                  >
                    <View className="flex-row items-center">
    <Ionicons 
    name={'car'} 
    size={40} 
    color={getPinColor(speed)} 
  />
                      <View className="ml-2">
                        {/*  <Text className="text-xs font-bold" style={{ color: getPinColor(speed) }}>
                          {speed} km/h
                        </Text>  */}
                      </View>
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold">{vehicle.name}</Text>
                      <Text className="text-gray-600">{locText}</Text>
                      <Text className="text-gray-600">{status}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>

      {mapFullScreen && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
        }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: -26.2041,
              longitude: 28.0473,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            {displayVehicles.slice(0,3).map((vehicle, index) => {
              const queryIndex = displayVehicles.indexOf(vehicle);
              const queries = vehicleQueries[queryIndex];
              
              const speed = queries.speed.data?.speed_data?.[0]?.speed ?? (vehicle as any)?.latestSpeed ?? 0;
              const ignition = queries.ignition.data?.ignition_data?.[0]?.ignition_status ?? (vehicle as any)?.ignitionStatus ?? 'Off';
              const status = speed > 0 ? 'Moving' : 'Parked';
              
              const hasLat = queries.gps.data?.gps_data?.[0]?.latitude !== null && queries.gps.data?.gps_data?.[0]?.latitude !== undefined;
              const hasLon = queries.gps.data?.gps_data?.[0]?.longitude !== null && queries.gps.data?.gps_data?.[0]?.longitude !== undefined;
              const coords = hasLat && hasLon
                ? { 
                    latitude: Number(queries.gps.data?.gps_data?.[0]?.latitude), 
                    longitude: Number(queries.gps.data?.gps_data?.[0]?.longitude)
                  }
                : dummyCoords[index % dummyCoords.length];
              
              return (
                <Marker
                  key={vehicle.id}
                  coordinate={coords}
                  title={vehicle.name}
                  description={`${status} - ${speed} km/h`}
                  pinColor={getPinColor(speed)}
                />
              );
            })}
          </MapView>

          <Pressable
            onPress={toggleMapFullScreen}
            style={{
              position: 'absolute',
              top: 50,
              right: 20,
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1001,
            }}
          >
            <Ionicons name="close" size={24} color="white" />
          </Pressable>
        </View>
      )}

      {vehiclesFullScreen && (
        <SafeAreaView style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
        }}>
          <View className="flex-1 px-4">
            <View className="flex-row justify-between items-center px-4 py-4">
              <Text className="text-2xl font-bold">Your Vehicles</Text>
              <Pressable
                onPress={toggleVehiclesFullScreen}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={24} color="white" />
              </Pressable>
            </View>

            <ScrollView className="flex-1 px-4">
              {displayVehicles.map((vehicle) => {
                const queryIndex = displayVehicles.indexOf(vehicle);
                const queries = vehicleQueries[queryIndex];
                
                const speed = queries.speed.data?.speed_data?.[0]?.speed ?? (vehicle as any)?.latestSpeed ?? 0;
                const ignition = queries.ignition.data?.ignition_data?.[0]?.ignition_status ?? (vehicle as any)?.ignitionStatus ?? 'Off';
                const status = speed > 0 ? 'Moving' : 'Parked';
                
                const hasLat = queries.gps.data?.gps_data?.[0]?.latitude !== null && queries.gps.data?.gps_data?.[0]?.latitude !== undefined;
                const hasLon = queries.gps.data?.gps_data?.[0]?.longitude !== null && queries.gps.data?.gps_data?.[0]?.longitude !== undefined;
                const coordText = hasLat && hasLon 
                  ? `${Number(queries.gps.data?.gps_data?.[0]?.latitude).toFixed(5)}, ${Number(queries.gps.data?.gps_data?.[0]?.longitude).toFixed(5)}`
                  : null;
                const locText = vehicle.location && vehicle.location !== 'Unknown' 
                  ? vehicle.location 
                  : (coordText ?? 'Unknown');

                return (
                  <Pressable
                    key={vehicle.id}
                    onPress={() => {
                      router.push({
                        pathname: '/screens/home/location/location',
                        params: { vehicle: JSON.stringify(vehicle) },
                      });
                    }}
                    className="bg-white rounded-lg p-4 m-2 shadow-md flex-row items-center"
                  >
                  <View className="flex-row items-center">
  <Ionicons 
    name={'car'} 
    size={40} 
    color={getPinColor(speed)} 
  />
</View>
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold">{vehicle.name}</Text>
                      <Text className="text-gray-600">{locText}</Text>
                      <Text className="text-gray-600">{status}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}

      {dropdownVisible && (
        <>
          <Pressable
            onPress={() => {
              Animated.timing(dropdownAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setDropdownVisible(false);
              });
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              backgroundColor: 'transparent',
            }}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: 80,
              right: 16,
              backgroundColor: 'white',
              borderRadius: 8,
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
              zIndex: 1000,
              opacity: dropdownAnim,
            }}
          >
            <Pressable onPress={() => { router.push('/screens/profile/profile'); setDropdownVisible(false); }} className="p-4 border-b border-gray-200">
              <Text>View Profile</Text>
            </Pressable>
            <Pressable onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'No', style: 'cancel' },
                  { text: 'Yes', onPress: () => router.replace('/screens/auth/auth') },
                ]
              );
              setDropdownVisible(false);
            }} className="p-4">
              <Text>Logout</Text>
            </Pressable>
          </Animated.View>
        </>
      )}

      {deviceHealthModal && (
        <>
          <Pressable
            onPress={() => setDeviceHealthModal(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2000,
            }}
          />

          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2001,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
            }}
            pointerEvents="box-none"
          >
            <View
              style={{
                width: '100%',
                maxWidth: 400,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <View className="items-center mb-4">
                <View className="bg-red-100 rounded-full p-3 mb-2">
                  <Ionicons name="warning" size={32} color="#DC2626" />
                </View>
                <Text className="text-xl font-bold text-center text-gray-900">
                  Device Health Alert
                </Text>
              </View>

              <Text className="text-gray-700 text-center mb-6 leading-5">
                One of your devices linked to your Toyota Camry has stopped responding and may need attention. Please check the device health status.
              </Text>

              <View className="flex-row justify-between gap-3">
                <Pressable
                  onPress={() => {
                    setDeviceHealthModal(false);
                    modalDismissedRef.current = true;
                  }}
                  className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                >
                  <Text className="text-gray-700 font-semibold">Dismiss</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setDeviceHealthModal(false);
                    router.push('/screens/device-health');
                  }}
                  className="flex-1 bg-red-500 rounded-lg py-3 items-center"
                >
                  <Text className="text-white font-semibold">Review</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
