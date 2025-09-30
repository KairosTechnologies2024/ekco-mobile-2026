import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Pressable, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Home() {
  const router = useRouter();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const [mapFullScreen, setMapFullScreen] = useState(false);
  const [vehiclesFullScreen, setVehiclesFullScreen] = useState(false);
  const [deviceHealthModal, setDeviceHealthModal] = useState(false);
  const modalDismissedRef = useRef(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Slider data and state
  const sliderData = [
    {
      id: 1,
      title: "Effortlessly keep track of\nall your vehicles",
      backgroundColor: '#000'
    },
    {
      id: 2,
      title: "Monitor your fleet in\nreal-time",
      backgroundColor: '#182f51'
    },
    {
      id: 3,
      title: "Stay connected with your\nvehicles 24/7",
      backgroundColor: '#DC2626'
    },
    {
      id: 4,
      title: "Track location, status, and\nperformance",
      backgroundColor: '#7C3AED'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      // Animate dropdown closing
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setDropdownVisible(false);
      });
    } else {
      // Show dropdown and animate opening
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

    // Detect if scrolling up or down
    if (Math.abs(currentScrollY - lastScrollY) > 10) { // Minimum threshold to avoid accidental triggers
      if (!isScrolling) {
        setIsScrolling(true);
        // Trigger full screen mode when scrolling starts
        setVehiclesFullScreen(true);

        // Reset scrolling state after a short delay
        setTimeout(() => {
          setIsScrolling(false);
        }, 500);
      }
    }

    setLastScrollY(currentScrollY);
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderData.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Show device health modal on first visit, but not if dismissed
  useEffect(() => {
    if (!modalDismissedRef.current) {
      setDeviceHealthModal(true);
    }
  }); // No dependency array means this runs on every mount and update

  // Reset dismissed state when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      modalDismissedRef.current = false;
    };
  }, []);

  const vehicles = [
    { id: 1, name: 'Toyota Camry', location: 'Downtown', status: 'Moving' },
    { id: 2, name: 'Honda Civic', location: 'Suburb', status: 'Parked' },
    { id: 3, name: 'Ford Mustang', location: 'Highway', status: 'Moving' },
    { id: 4, name: 'Chevrolet Malibu', location: 'Airport', status: 'Parked' },
    { id: 5, name: 'Nissan Altima', location: 'Mall', status: 'Moving' },
    { id: 6, name: 'BMW 3 Series', location: 'Downtown', status: 'Parked' },
    { id: 7, name: 'Audi A4', location: 'Suburb', status: 'Moving' },
    { id: 8, name: 'Mercedes C-Class', location: 'Highway', status: 'Parked' },
    { id: 9, name: 'Volkswagen Passat', location: 'Airport', status: 'Moving' },
    { id: 10, name: 'Hyundai Sonata', location: 'Mall', status: 'Parked' },
  ];

  const dummyCoords = [
    { latitude: -26.2041, longitude: 28.0473 },
    { latitude: -26.2441, longitude: 28.0873 },
    { latitude: -26.2841, longitude: 28.1273 },
  ];

  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="flex-row justify-between items-center px-4 py-4">
        {/* Left Side - Greeting */}
        <Text className="text-3xl font-bold">
          Good morning, {'\n'}Nhlamulo 😁
        </Text>

        {/* Right Side - Profile Pic and Notification Bell */}
        <View className="flex-row items-center">
          {/* Notification Bell with Badge */}
          <Pressable onPress={() => router.push('/alerts')} className="relative mr-4">
            <Ionicons name="notifications-outline" size={32} color="black" />
            {/* Unread Badge */}
            <View className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
              <Text className="text-white text-xs">3</Text>
            </View>
          </Pressable>

          {/* Profile Pic */}
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
          // Animate dropdown closing on outside press
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
            className='h-32 w-full rounded-2xl px-6 py-6 flex justify-center mt-4'
            style={{ backgroundColor: sliderData[currentSlide].backgroundColor }}
          >
           
              <Text className='text-white text-xl font-bold'>
                {sliderData[currentSlide].title}
              </Text>
          
          </View>

          <View className="mt-4 ">
            <View className="flex-row items-center bg-white rounded-full px-4 border border-gray-400">

              <TextInput
                placeholder="search vehicle"
                className="flex-1 ml-2 "
              />
                <Ionicons name="search" size={20} color="gray" />
            </View>
          </View>

          <Text className="text-xl font-bold mt-4 px-4">Your Vehicle(s) Current Position</Text>

          <MapView
            style={mapFullScreen ? { flex: 1 } : { height: 192, marginHorizontal: 16, marginTop: 8, borderRadius: 8 }}
            initialRegion={{
              latitude: -26.2041,
              longitude: 28.0473,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            onPress={toggleMapFullScreen}
          >
            {vehicles.slice(0,3).map((vehicle, index) => {
              const pinColors = ['red', 'blue', 'green'];
              const color = pinColors[index % 3];
              const coords = dummyCoords[index % dummyCoords.length];
              return (
                <Marker
                  key={vehicle.id}
                  coordinate={coords}
                  title={vehicle.name}
                  description={vehicle.status}
                  pinColor={color}
                />
              );
            })}
          </MapView>

          <Pressable onPress={toggleVehiclesFullScreen} style={vehiclesFullScreen ? { flex: 1 } : { maxHeight: 300 }}>
            <ScrollView
              className="mt-4"
              style={vehiclesFullScreen ? { flex: 1 } : { maxHeight: 300 }}
              onScroll={handleVehicleScroll}
              scrollEventThrottle={16}
            >
              {vehicles.map((vehicle, index) => {
                const pinColors = ['red', 'blue', 'green'];
                const color = pinColors[index % 3];
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
                    <Ionicons name="car" size={40} color={color} />
                    <View className="ml-4">
                      <Text className="text-lg font-bold">{vehicle.name}</Text>
                      <Text className="text-gray-600">{vehicle.location}</Text>
                      <Text className="text-gray-600">{vehicle.status}</Text>
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
            {vehicles.slice(0,3).map((vehicle, index) => {
              const pinColors = ['red', 'blue', 'green'];
              const color = pinColors[index % 3];
              const coords = dummyCoords[index % dummyCoords.length];
              return (
                <Marker
                  key={vehicle.id}
                  coordinate={coords}
                  title={vehicle.name}
                  description={vehicle.status}
                  pinColor={color}
                />
              );
            })}
          </MapView>

          {/* Close button */}
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
              {vehicles.map((vehicle, index) => {
                const pinColors = ['red', 'blue', 'green'];
                const color = pinColors[index % 3];
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
                    <Ionicons name="car" size={40} color={color} />
                    <View className="ml-4 flex-1">
                      <Text className="text-lg font-bold">{vehicle.name}</Text>
                      <Text className="text-gray-600">{vehicle.location}</Text>
                      <Text className="text-gray-600">{vehicle.status}</Text>
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
              // Animate dropdown closing on outside press
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
          {/* Backdrop */}
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

          {/* Modal */}
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
              {/* Warning Icon */}
              <View className="items-center mb-4">
                <View className="bg-red-100 rounded-full p-3 mb-2">
                  <Ionicons name="warning" size={32} color="#DC2626" />
                </View>
                <Text className="text-xl font-bold text-center text-gray-900">
                  Device Health Alert
                </Text>
              </View>

              {/* Alert Message */}
              <Text className="text-gray-700 text-center mb-6 leading-5">
                One of your devices linked to your Toyota Camry has stopped responding and may need attention. Please check the device health status.
              </Text>

              {/* Buttons */}
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
