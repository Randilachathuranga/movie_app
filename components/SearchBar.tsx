import { Image, TextInput, View } from 'react-native'

import React from 'react'
import { icons } from '@/constants/icons'

export default function SearchBar() {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E1E2E',
      borderRadius: 25,
      paddingHorizontal: 16, // Reduced from 120 to a reasonable value
      paddingVertical: 12,
    }}>
      <Image
        source={icons.search}
        style={{
          width: 20,
          height: 20,
          marginRight: 8, // Added margin to the right instead of left
        }}
        resizeMode='contain'
        tintColor='#ab8bff'
      />
      
      <TextInput
        onPressIn={() => {}}
        placeholder='Search...'
        value=''
        placeholderTextColor='#a8b5bd'
        style={{
          flex: 1,
          color: 'white',
        }}
      />
    </View>
  )
}