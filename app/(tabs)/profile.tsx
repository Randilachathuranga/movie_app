import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [profileStats] = useState([
    { label: "Movies Watched", value: 147, icon: icons.play },
    { label: "Watchlist", value: 23, icon: icons.save },
    { label: "Favorite Genre", value: "Action", icon: icons.star },
  ]);

  useEffect(() => {
    // Redirect to sign-in if not logged in
    if (!isLoggedIn) {
      router.replace("/sign-in");
    }
  }, [isLoggedIn]);

  const menuItems = [
    { title: "Edit Profile", icon: icons.person },
    { title: "Preferences", icon: icons.star },
    { title: "Notifications", icon: icons.arrow },
    { title: "Privacy", icon: icons.save },
    { title: "Help & Support", icon: icons.search },
  ];

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/sign-in");
            } catch {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          }
        }
      ]
    );
  };

  // Show loading or redirect if not authenticated
  if (!isLoggedIn || !user) {
    return null;
  }

  // Format join date from user creation date
  const joinDate = user.$createdAt ? new Date(user.$createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }) : "Recently";

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="items-center pt-8 pb-6">
          <Text className="text-white text-2xl font-bold mb-2">Profile</Text>
        </View>

        {/* Profile Info */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-accent rounded-full items-center justify-center mb-4">
            <Image source={icons.person} className="w-12 h-12" tintColor="#D6C6FF" />
          </View>
          <Text className="text-white text-xl font-semibold mb-1">{user.name}</Text>
          <Text className="text-light-300 text-base mb-1">{user.email}</Text>
          <Text className="text-light-300 text-sm">Member since {joinDate}</Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-8">
          <Text className="text-white text-lg font-semibold mb-4">Statistics</Text>
          <View className="flex-row justify-between">
            {profileStats.map((stat, index) => (
              <View key={index} className="bg-accent rounded-lg p-4 flex-1 mx-1 items-center">
                <Image source={stat.icon} className="w-6 h-6 mb-2" tintColor="#D6C6FF" />
                <Text className="text-white text-lg font-bold">{stat.value}</Text>
                <Text className="text-light-300 text-xs text-center">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="mb-8">
          <Text className="text-white text-lg font-semibold mb-4">Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} className="bg-accent rounded-lg p-4 mb-3 flex-row items-center">
              <Image source={item.icon} className="w-5 h-5 mr-4" tintColor="#D6C6FF" />
              <Text className="text-white text-base flex-1">{item.title}</Text>
              <Image source={icons.arrow} className="w-4 h-4" tintColor="#A8B5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleSignOut} className="bg-red-600 rounded-lg p-4 mb-8">
          <Text className="text-white text-center font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;