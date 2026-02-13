import { movieApi } from "@/api/endpoints";
import HeroSection from "@/components/HeroSection";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Movie } from "@/types/movie";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import MovieRow from "../../components/MovieRow";
import { COLORS, SPACING } from "../../constants/theme";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const [trending, popular, topRated, nowPlaying, upcoming] =
        await Promise.all([
          movieApi.getTrending("day"),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getNowPlaying(),
          movieApi.getUpcoming(),
        ]);

      if (trending.success && trending.data) {
        setTrendingMovies(trending.data.results);
      }
      if (popular.success && popular.data) {
        setPopularMovies(popular.data.results);
      }
      if (topRated.success && topRated.data) {
        setTopRatedMovies(topRated.data.results);
      }
      if (nowPlaying.success && nowPlaying.data) {
        setNowPlayingMovies(nowPlaying.data.results);
      }
      if (upcoming.success && upcoming.data) {
        setUpcomingMovies(upcoming.data.results);
      }
    } catch (error) {
      console.error("Error Loading Movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {trendingMovies.length > 0 && <HeroSection movie={trendingMovies[0]} />}

      <View style={styles.content}>
        {trendingMovies.length > 0 && (
          <MovieRow title="Trending Now" movies={trendingMovies} />
        )}
        {popularMovies.length > 0 && (
          <MovieRow title="Popular on Netflix" movies={popularMovies} />
        )}
        {topRatedMovies.length > 0 && (
          <MovieRow title="Top Rated" movies={topRatedMovies} />
        )}
        {nowPlayingMovies.length > 0 && (
          <MovieRow title="Now Playing" movies={nowPlayingMovies} />
        )}
        {upcomingMovies.length > 0 && (
          <MovieRow title="Coming Soon" movies={upcomingMovies} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    paddingBottom: SPACING.XL,
  },
});
