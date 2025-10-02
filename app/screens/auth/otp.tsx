import { useVerify2FAMutation } from '@/store/api/authApi';
import { setUser } from '@/store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch } from 'react-redux';

export default function OtpScreen() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [verify2FA, { isLoading }] = useVerify2FAMutation();

    const handleSubmit = async () => {
        try {
            const response = await verify2FA({ token: otp, userId }).unwrap();
            console.log('OTP Verification Response:', response);
            dispatch(setUser({ user: response.user, token: response.accessToken, refreshToken: response.refreshToken, userId: response.userId }));
            setModalVisible(true);
            setTimeout(() => {
                setModalVisible(false);
                router.push('/(tabs)/home');
            }, 1000);
        } catch (error) {
            console.log('OTP Verification Error:', error);
            Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
        }
    };

    return (
        <>
            <View className="flex-1 bg-primary-background-color px-6 justify-center">
                <View className="w-full max-w-md self-center">
                    {/* Logo */}
                    <View className='mb-6 relative'>
                        <Image
                            source={require('../../../assets/images/ekco logo white.png')}
                            className="w-36 h-36 self-center"
                            resizeMode="contain"
                        />
                        <Text className='text-white text-sm text-center uppercase absolute top-28 left-1/2 transform -translate-x-1/2'>Vehicle Tracking</Text>
                    </View>

                    {/* Title */}
                    <Text className="text-white text-lg mb-8 text-center font-bold">
                        Enter OTP sent to your email
                    </Text>

                    {/* Form */}
                    <View className="space-y-4">
                        <TextInput
                            placeholder="OTP"
                            placeholderTextColor="#999"
                            className="border border-white text-black p-3 rounded bg-secondary-background-color w-full mb-6"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            className="bg-accent-color p-3 rounded items-center w-full"
                            onPress={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Submit OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                {/* Back to Login */}
                <View className="mt-8 items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-gray-400 underline">Back to Login</Text>
                    </TouchableOpacity>
                </View>
                    {/* Footer */}
                    <View className="mt-8 space-y-1 items-center">
                        <Text className="text-gray-300">developed by</Text>
                        <Image
                            source={require('../../../assets/images/kairos tech logo white 2.png')}
                            className="w-28 h-28 mb-6 self-center"
                            resizeMode="contain"
                        />
                        <Text className="text-gray-300">version 1.13.3</Text>
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>OTP Verification Successful</Text>
                        <Ionicons name="checkmark-circle" size={48} color="green" />
                    </View>
                </View>
            </Modal>
        </>
    );
}
