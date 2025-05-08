import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { height } = Dimensions.get('window');

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: loadMovies,
    reset,
  } = useFetch(() =>
    fetchMovies({
      query: searchQuery,
    })
  );

  // Fetch movies initially and when the searchQuery changes
  useEffect(() => {
        
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim() || searchQuery === "") {
        await loadMovies();
      } else {
        reset();
      }
    }, 500); // 500ms delay to avoid too many requests

    return () => clearTimeout(timeoutId); // Cleanup the timeout on unmount or when searchQuery changes
  }, [searchQuery]);

  useEffect(()=>{
    if((movies ?? []).length > 0 && movies?.[0] ){
      updateSearchCount(searchQuery, movies?.[0]);
    }
  },[movies])

  // Trigger initial fetch when the component mounts
  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <View className="flex-1 bg-primary">
      {/* Background image */}
      <Image
        source={images.bg}
        style={{
          position: "absolute",
          width: "100%",
          height: "70%",
        }}
        resizeMode="cover"
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
          minHeight: height + 200,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex-row justify-center">
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
        </View>

        <View className="my-5 w-full">
          <SearchBar
            placeholder="Search for a movie"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
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
          <Text className="text-red-500 my-3">
            Error: {moviesError.message}
          </Text>
        )}

        {!moviesLoading &&
          !moviesError &&
          searchQuery.trim() &&
          (movies ?? []).length > 0 && (
            <Text className="text-xl text-white font-bold mb-3">
              Search Results
              <Text className="text-accent"> {searchQuery}</Text>
            </Text>
          )}

        {!moviesLoading && (movies ?? []).length > 0 ? (
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieCard {...item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              marginRight: 5,
              marginBottom: 10,
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        ) : (
          !moviesLoading && searchQuery && (
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
          )
        )}
      </ScrollView>
    </View>
  );
};

export default Search;