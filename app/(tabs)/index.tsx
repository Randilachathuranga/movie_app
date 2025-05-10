import { Dimensions, FlatList, Image, ScrollView, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { icons } from "@/constants/icons";
import { images } from '@/constants/images';
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError 
  } = useFetch(getTrendingMovies)
  
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
            width: 170,
            height: 170,
            marginTop: 95,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        
        <View style={{ flex: 1, marginTop: 20, width: '100%' }}>
          <SearchBar
            onPress={() => router.push('/search')}
            placeholder="Search for a movie"
          />
          
          {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}
    
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