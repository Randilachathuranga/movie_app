import { Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? "/(tabs)" : "/sign-in"} />;
}
