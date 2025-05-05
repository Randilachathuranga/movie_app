import React from 'react';
import { Image, TextInput, View } from 'react-native';

import { icons } from '@/constants/icons';

interface Props {
  placeholder: string;
  onPress: () => void;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({placeholder, onPress , value, onChangeText} : Props) {

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E1E2E',
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: '100%', // Ensures full width of parent container
    }}>
      <Image
        source={icons.search}
        style={{
          width: 20,
          height: 20,
          marginRight: 8,
        }}
        resizeMode='contain'
        tintColor='#ab8bff'
      />

      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor='#a8b5bd'
        style={{
          flex: 1,
          color: 'white',
        }}
        returnKeyType="search"
      />
    </View>
  );
}
