import { Dimensions, Image, ScrollView, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { Link } from 'expo-router';
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from '@/constants/images';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  
  const { height } = Dimensions.get('window');
  
  return (
    <View style={{flex: 1, backgroundColor: '#030014'}}>
      <Image
        source={images.bg}
        style={{
          position: 'absolute',
          width: '100%',
          height: '70%',
        }}
        resizeMode="cover"
      />
      
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          minHeight: height + 200, // Make content taller than screen to enable scrolling
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={icons.logo}
          style={{
            width: 70,
            height: 70,
            marginTop: 50,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        
        {/* Add more content here to make it scrollable */}
        <View style={{ flex: 1, marginTop: 20 }}>
          <SearchBar 
            onPress={() => router.push('/search')}
            placeholder="Search for a movie"
          />
        </View>
      </ScrollView>
    </View>
  );
}