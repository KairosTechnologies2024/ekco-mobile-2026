import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AuthScreen() {
    const loading = false;
    const router= useRouter();


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
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#999"
                        className="border border-white text-white p-3 rounded bg-secondary-background-color w-full mb-4"
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry
                        className="border border-white text-white p-3 rounded bg-secondary-background-color w-full mb-6"
                    />

                    <TouchableOpacity
                        className="bg-accent-color p-3 rounded items-center"
                        activeOpacity={0.8}

                        onPress= {()=> router.push('/(tabs)/home')}
                    >
                        {loading ? (
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
        </View>
    );
}
