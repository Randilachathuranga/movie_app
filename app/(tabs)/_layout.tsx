import { Image, ImageBackground, Text, View } from 'react-native'

import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'

const TabIcon = ({ focused, icon, label }: any) => {
 if(focused) {
  return (
    <ImageBackground
      source={images.highlight}
      style={{
        opacity: focused ? 1 : 0.8, // Apply opacity based on focused state
      }}
      className="flex flex-row w-full flex-1 min-w-[112px] min-h-16
       mt-4 justify-center items-center rounded-full overflow-hidden"
    >
      <Image 
        source={icon}
        tintColor="#151312" 
        className="size-5 mr-1" // Added margin-right to create gap
      />
      <Text className='text-secondery text-base font-semibold'>{label}</Text>
    </ImageBackground>
  )
 }
  else {
    return (
      <View className="flex flex-row w-full flex-1 min-w-[112px] min-h-14
        mt-4 justify-center items-center rounded-full overflow-hidden">
        <Image 
          source={icon}
          tintColor="#ffffff" 
          className="size-5 mr-2" // Added margin-right to create gap
        />
        <Text className='text-secondery text-base font-semibold'>{label}</Text>
      </View>
    )
  }

}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarItemStyle:{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#0f0D23',
          
        },
        tabBarShowLabel: false, // Hide labels on the tab bar
      }
}
    >
      <Tabs.Screen
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.home} 
              label="Home"
            />
          )
        }} 
      />


      <Tabs.Screen
        name="search" 
        options={{ 
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.search} 
              label="Search"
            />
          ) 
        }} 
      />

<Tabs.Screen
        name="saved" 
        options={{ 
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.save} 
              label="Saved"
            />
          )
        }} 
      />


      <Tabs.Screen
        name="profile" 
        options={{ 
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={icons.person} 
              label="Profile" // Fixed label for profile tab
            />
          ) 
        }} 
      />
    </Tabs>
  )
}