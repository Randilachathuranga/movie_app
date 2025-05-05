import { Dimensions, FlatList, Image, ScrollView, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from '@/constants/images';
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError 
  } = useFetch(() => fetchMovies({
    query: ''
  }));
  
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
            marginTop: 95,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        
        <View style={{ flex: 1, marginTop: 20, width: '100%' }}>
          <SearchBar
            onPress={() => router.push('/search')}
            placeholder="Search for a movie"
            value=""
            onChangeText={() => {}}
          />
          
    
          <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}>
            Latest Movies
          </Text>
               
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              // all movie cards
              <MovieCard  
                {...item}
              />
            )}

            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              gap: 20,
              marginRight: 5,
              marginBottom: 10,
            }}

            className="mt-2 pb-32"
            scrollEnabled={false}
          />
     
        </View>
      </ScrollView>
    </View>
  );
}