import { Link, router } from 'expo-router';
import React, { useState } from 'react';
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

import { icons } from '@/constants/icons';
import { useAuth } from '@/context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (form.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log("Attempting registration for:", form.email);
    setIsSubmitting(true);
    try {
      await register(form.email, form.password, form.name);
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
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
                Create Account
              </Text>
              <Text className="text-light-300 text-base mt-2 text-center">
                Join MovieApp to discover amazing films
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              <View>
                <Text className="text-base text-gray-100 font-medium mb-2">
                  Full Name
                </Text>
                <View className="border-2 border-dark-200 w-full h-16 px-4 bg-dark-100 rounded-2xl focus:border-light-100 flex-row items-center">
                  <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={form.name}
                    placeholder="Enter your full name"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, name: e })}
                  />
                </View>
              </View>

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
                    placeholder="Create a password (min. 8 characters)"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setForm({ ...form, password: e })}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={submit}
                activeOpacity={0.7}
                className={`bg-light-100 rounded-xl min-h-[62px] justify-center items-center ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
                disabled={isSubmitting}
              >
                <Text className="text-secondary font-psemibold text-lg">
                  {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Already have an account?
              </Text>
              <Link 
                href="./sign-in" 
                className="text-lg font-psemibold text-light-100"
              >
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
