import { useResetPasswordMutation } from '@/store/api/authApi';
import { useRouter, useSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewPasswordScreen() {
  const router = useRouter();
  const { token } = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Validate the token presence when the screen is first rendered
  useEffect(() => {
    if (!token) {
      Alert.alert('Invalid Link', 'Reset password token is missing.');
      router.replace('/screens/auth/auth');
    } else {
      setIsTokenValid(true);  // Token is present, proceed with screen rendering
    }
  }, [token]);

  // Form validation
  const validate = () => {
    let valid = true;
    let newErrors = { newPassword: '', confirmPassword: '' };

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      valid = false;
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle password reset submission
  const handleReset = async () => {
    if (!validate()) return;

    try {
      await resetPassword({ newPassword, token }).unwrap();
      Alert.alert('Success', 'Password has been reset successfully.');
      router.replace('/screens/auth/auth');
    } catch (error) {
      console.log('Reset password error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  // If token is missing or invalid, show a loading state
  if (!isTokenValid || isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-background-color">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
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
          Reset Password
        </Text>

        {/* Form */}
        <View className="space-y-4">
          {errors.newPassword ? <Text className="text-red-500 mb-1">{errors.newPassword}</Text> : null}
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#999"
            secureTextEntry
            className="border border-white text-black p-3 rounded bg-secondary-background-color w-full mb-4"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {errors.confirmPassword ? <Text className="text-red-500 mb-1">{errors.confirmPassword}</Text> : null}
          <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor="#999"
            secureTextEntry
            className="border border-white text-black p-3 rounded bg-secondary-background-color w-full mb-4"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            className="bg-accent-color p-3 rounded items-center"
            activeOpacity={0.8}
            onPress={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">Reset Password</Text>
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
  );
}
