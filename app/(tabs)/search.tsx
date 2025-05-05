import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, SafeAreaView, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import SearchBar from "@/components/SearchBar";

const Search = () => {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "", // Will fetch popular movies if empty
    })
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
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
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingVertical: 20 }}

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
                <SearchBar placeholder="Search for a movie" onPress={() => router.push('/search')} />
              </View>

              {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            </>
          }

        />

      
    </SafeAreaView>
  );
};

export default Search;
