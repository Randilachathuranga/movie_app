import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';

import { NetworkDiagnostics } from '@/components/NetworkDiagnostics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/constants/icons';
import { testAppwriteConnection } from '@/utils/testAppwrite';
import { useAuth } from '@/context/AuthContext';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { login } = useAuth();

  const testConnection = async () => {
    console.log("Testing Appwrite connection...");
    const isConnected = await testAppwriteConnection();
    Alert.alert(
      "Connection Test", 
      isConnected ? "✅ Appwrite connection successful!" : "❌ Appwrite connection failed! Check console for details."
    );
  };

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    console.log("Attempting sign in with:", form.email);
    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      Alert.alert('Success', 'Login successful!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="h-full"
      >
        <ScrollView className="px-4 my-6">
          <View className="w-full justify-center min-h-[85vh] px-4 my-6">
            {/* Logo */}
            <View className="items-center mb-10">
              <Image 
                source={icons.logo} 
                className="w-20 h-20 mb-4" 
                tintColor="#D6C6FF"
              />
              <Text className="text-3xl font-bold text-white text-center">
                Welcome Back
              </Text>
              <Text className="text-light-300 text-base mt-2 text-center">
                Sign in to continue to MovieApp
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              <View>
                <Text className="text-base text-gray-100 font-medium mb-2">
                  Email
                </Text>
                <View className="border-2 border-dark-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-light-100 flex-row items-center">
                  <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={form.email}
                    placeholder="Enter your email"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, email: e })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View>
                <Text className="text-base text-gray-100 font-medium mb-2">
                  Password
                </Text>
                <View className="border-2 border-dark-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-light-100 flex-row items-center">
                  <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={form.password}
                    placeholder="Enter your password"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, password: e })}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                onPress={submit}
                activeOpacity={0.7}
                className={`bg-light-100 rounded-xl min-h-[62px] justify-center items-center ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
                disabled={isSubmitting}
              >
                <Text className="text-secondary font-psemibold text-lg">
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>


              {/* Network Diagnostics Toggle */}
              <TouchableOpacity
                onPress={() => setShowDiagnostics(!showDiagnostics)}
                activeOpacity={0.7}
                className="bg-dark-200 rounded-xl min-h-[40px] justify-center items-center mt-2"
              >
                <Text className="text-light-300 font-psemibold text-xs">
                  {showDiagnostics ? 'Hide' : 'Show'} Network Diagnostics
                </Text>
              </TouchableOpacity>
            </View>

            {/* Network Diagnostics */}
            {showDiagnostics && (
              <View className="mt-4">
                <NetworkDiagnostics />
              </View>
            )}

            {/* Sign Up Link */}
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don&apos;t have an account?
              </Text>
              <Link 
                href="./sign-up" 
                className="text-lg font-psemibold text-light-100"
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
