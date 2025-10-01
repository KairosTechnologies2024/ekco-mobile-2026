import { useLoginMutation } from '@/store/api/authApi';
import { setUser } from '@/store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    const [email, setEmail] = useState('nhlamulo@kairostechnology.co.za');
    const [password, setPassword] = useState('qwerty');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

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
