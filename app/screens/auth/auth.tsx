import { useGetCustomerByUserIdQuery, useGetCustomerVehiclesQuery, useLoginMutation } from '@/store/api/authApi';
import { setCustomer, setUser, setVehicles } from '@/store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';

export default function AuthScreen() {
    const [email, setEmail] = useState('roadsidecoders@gmail.com');
    const [password, setPassword] = useState('password');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [userIdForCustomer, setUserIdForCustomer] = useState<string | null>(null);
    const { data: customerData, refetch: refetchCustomer } = useGetCustomerByUserIdQuery(userIdForCustomer || '', {
        skip: !userIdForCustomer,
    });
    const { data: vehiclesData, refetch: refetchVehicles } = useGetCustomerVehiclesQuery(userIdForCustomer || '', {
        skip: !userIdForCustomer,
    });

    useEffect(() => {
        if (customerData) {
            console.log('Customer Data:', customerData);
            dispatch(setCustomer(customerData));
        }
    }, [customerData, dispatch]);

    useEffect(() => {
        if (vehiclesData) {
            console.log('Vehicles Data:', vehiclesData);
            if (vehiclesData.vehicles) {
              const transformedVehicles = vehiclesData.vehicles.map((vehicle: any) => {
                // Fetch speed data synchronously or use a placeholder
                // Since hooks can't be used in loops, we'll set status later
                return {
                  id: vehicle.id,
                  name: vehicle.vehicle_model,
                  location: 'Unknown', // Placeholder, as location isn't in the data
                  status: 'Loading...', // Placeholder, will be updated
                  plate: vehicle.vehicle_plate,
                  serial: vehicle.device_serial,
                };
              });
              dispatch(setVehicles(transformedVehicles));

              // Now fetch speed and GPS for each vehicle and update status and position
              vehiclesData.vehicles.forEach(async (vehicle: any, index: number) => {
                if (vehicle.device_serial) {
                  try {
                    // Fetch speed data
                    const speedResponse = await fetch(`http://192.168.10.41:3003/api/customers/speed/${vehicle.device_serial}`);
                    const speedData = await speedResponse.json();
                    const speedEntries = speedData.speed_data || [];

                    let status = 'Parked';
                    if (Array.isArray(speedEntries) && speedEntries.length > 0) {
                      // Sort by time descending to get latest
                      const sortedEntries = speedEntries.sort((a: any, b: any) => parseInt(b.time) - parseInt(a.time));
                      const latestSpeed = Number(sortedEntries[0].speed || 0);
                      status = latestSpeed > 0 ? 'Moving' : 'Parked';
                    }

                    // Fetch GPS data
                    const gpsResponse = await fetch(`http://192.168.10.41:3003/api/customers/gps/${vehicle.device_serial}`);
                    const gpsData = await gpsResponse.json();
                    console.log('GPS Data for', vehicle.device_serial, ':', gpsData);
                    const gpsEntries = gpsData.gps_data || [];

                    let latitude = null;
                    let longitude = null;
                    if (Array.isArray(gpsEntries) && gpsEntries.length > 0) {
                      // Sort by time descending to get latest
                      const sortedGpsEntries = gpsEntries.sort((a: any, b: any) => parseInt(b.time) - parseInt(a.time));
                      latitude = Number(sortedGpsEntries[0].latitude);
                      longitude = Number(sortedGpsEntries[0].longitude);
                    }

                    // Update the vehicle status and position in Redux
                    const updatedVehicles = [...transformedVehicles];
                    updatedVehicles[index] = { ...updatedVehicles[index], status, latitude, longitude };
                    dispatch(setVehicles(updatedVehicles));
                  } catch (error) {
                    console.log('Error fetching data for', vehicle.device_serial, error);
                    // Set to Parked on error
                    const updatedVehicles = [...transformedVehicles];
                    updatedVehicles[index] = { ...updatedVehicles[index], status: 'Parked' };
                    dispatch(setVehicles(updatedVehicles));
                  }
                }
              });


            }
        }
    }, [vehiclesData, dispatch]);

    const handleLogin = async () => {
        let valid = true;
        let newErrors = { email: '', password: '' };
        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        }
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }
        setErrors(newErrors);
        if (!valid) return;

        try {
            const userData = await login({ email, password }).unwrap();
            console.log('API Response:', userData);

            if (!userData.token && userData.otpSent) {
                // Navigate to OTP screen with userId as param
                router.push(`/screens/auth/otp?userId=${userData.userId}`);
                return;
            }

            dispatch(setUser({ user: userData.user, token: userData.token }));

            // Trigger fetch of customer data after successful login
            setUserIdForCustomer(userData.user.id);

            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
                router.push('/(tabs)/home');
            }, 1000);
        } catch (error) {
            console.log('API Error Response:', error);
            alert('Login Failed: Invalid email or password');
        }
    };

    return (
        <View className="flex-1 bg-primary-background-color px-6 justify-center">
            <View className="w-full max-w-md self-center">
                {/* Logo */}
                <View className='mb-6  relative '>
                    <Image
                        source={require('../../../assets/images/ekco logo white.png')}
                        className="w-36 h-36  self-center"
                        resizeMode="contain"
                    />
                    <Text className='text-white text-sm text-center uppercase absolute top-28 left-1/2 transform -translate-x-1/2'>Vehicle Tracking</Text>
                </View>

                {/* Title */}
                <Text className="text-white text-sm mb-8 text-center">
                    please fill in your account details to continue.
                </Text>

                {/* Form */}
                <View className="space-y-4">
                     {errors.email ? <Text className="text-red-500 mb-1">{errors.email}</Text> : null}
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#999"
                        className="border border-white text-black p-3 rounded bg-secondary-background-color w-full mb-4"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                   
  {errors.password ? <Text className="text-red-500 mb-1">{errors.password}</Text> : null}
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        className="border border-white text-black p-3 rounded bg-secondary-background-color w-full mb-6"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                  

                    <TouchableOpacity
                        className="bg-accent-color p-3 rounded items-center"
                        activeOpacity={0.8}
                        onPress={handleLogin}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="mt-8 space-y-1 items-center">
                    <TouchableOpacity onPress={() => router.push('/screens/auth/reset-password')}>
                        <Text className="text-gray-400 underline mb-6">forgot password?</Text>
                    </TouchableOpacity>
                    <Text className="text-gray-300">developed by</Text>
                    <Image
                        source={require('../../../assets/images/kairos tech logo white 2.png')}
                        className="w-28 h-28 mb-6 self-center"
                        resizeMode="contain"
                    />
                    <Text className="text-gray-300">version 1.13.3</Text>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Login Successful</Text>
                        <Ionicons name="checkmark-circle" size={48} color="green" />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
