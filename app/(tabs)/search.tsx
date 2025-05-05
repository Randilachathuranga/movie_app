import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";

const Search = () => {

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() =>fetchMovies({
      query: searchQuery,
    }));

    //search movies when the searchQuery changes
    useEffect(()=>{
      const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      }else{
        reset();
      }
    }, 500); // 500ms delay to avoid too many requests

    return () => clearTimeout(timeoutId); // Cleanup the timeout on unmount or when searchQuery changes

    }, [searchQuery])

  return (
    <View className="flex-1 bg-primary">
      {/* Background image */}
      <Image
        source={images.bg}
        style={{
          position: 'absolute',
          width: '100%',
          height: '70%',
        }}
        resizeMode="cover"
      />

     
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
            
          ListHeaderComponent={
            <>
              <View className="w-full flex-row justify-center mt-20">
              <Image
          source={icons.logo}
          style={{
            width: 70,
            height: 70,
            marginTop: 0,
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
              </View>

              <View className="my-5 px-4">
                <SearchBar placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onPress={() => {}}
                />
              </View>

              {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}   


            {!moviesLoading && !moviesError && searchQuery.trim() && (movies ?? []).length > 0
            && (
              <Text className="text-xl text-white font-bold mb-3 px-5">
                Search Results
                <Text className="text-accent">  {searchQuery}</Text>
              </Text>
            )}
            </>
          }

          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Image
                source={icons.search}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
              <Text className="text-white text-lg font-bold mt-5">
                No Movies Found
              </Text>
            </View>
          }


        />

      
    </View>
  );
};

export default Search;
