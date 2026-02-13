import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getImageUrl, IMAGE_SIZES } from "../../api/config";
import { movieApi } from "../../api/endpoints";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieRow from "../../components/MovieRow";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  SPACING,
} from "../../constants/theme";
import { Cast, MovieDetails, Video } from "../../types/movie";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      const [detailsRes, videosRes, creditsRes, similarRes] = await Promise.all(
        [
          movieApi.getDetails(Number(id)),
          movieApi.getVideos(Number(id)),
          movieApi.getCredits(Number(id)),
          movieApi.getSimilar(Number(id)),
        ],
      );

      if (detailsRes.success && detailsRes.data) {
        setMovie(detailsRes.data);
      }
      if (videosRes.success && videosRes.data) {
        setVideos(videosRes.data.results.filter((v) => v.site === "YouTube"));
      }
      if (creditsRes.success && creditsRes.data) {
        setCast(creditsRes.data.cast.slice(0, 10));
      }
      if (similarRes.success && similarRes.data) {
        setSimilarMovies(similarRes.data.results);
      }
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !movie) {
    return <LoadingSpinner />;
  }

  const backdropUrl = getImageUrl(
    movie.backdrop_path,
    IMAGE_SIZES.BACKDROP.ORIGINAL,
  );
  const trailer = videos.find((v) => v.type === "Trailer") || videos[0];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{ uri: backdropUrl || undefined }}
        style={styles.backdrop}
      >
        <LinearGradient
          colors={["transparent", "rgba(20, 20, 20, 0.8)", COLORS.BACKGROUND]}
          style={styles.gradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline && (
              <Text style={styles.tagline}>{movie.tagline}</Text>
            )}

            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>
                ⭐ {movie.vote_average.toFixed(1)}
              </Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{movie.runtime} min</Text>
            </View>

            {trailer && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  // Open YouTube trailer
                  console.log("Play trailer:", trailer.key);
                }}
              >
                <Text style={styles.playButtonText}>▶ Watch Trailer</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        {/* Genres */}
        <View style={styles.genresContainer}>
          {movie.genres.map((genre) => (
            <View key={genre.id} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre.name}</Text>
            </View>
          ))}
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Cast */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cast.map((actor) => (
                <View key={actor.id} style={styles.castCard}>
                  {actor.profile_path ? (
                    <ImageBackground
                      source={{
                        uri:
                          getImageUrl(
                            actor.profile_path,
                            IMAGE_SIZES.PROFILE.MEDIUM,
                          ) || undefined,
                      }}
                      style={styles.castImage}
                    />
                  ) : (
                    <View style={[styles.castImage, styles.castPlaceholder]}>
                      <Text style={styles.castInitial}>
                        {actor.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.castName} numberOfLines={1}>
                    {actor.name}
                  </Text>
                  <Text style={styles.characterName} numberOfLines={1}>
                    {actor.character}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieRow title="More Like This" movies={similarMovies} />
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
  backdrop: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  heroContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  tagline: {
    fontSize: FONT_SIZES.SM,
    fontStyle: "italic",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.LG,
    gap: SPACING.SM,
  },
  metaText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  playButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: "center",
  },
  playButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
  content: {
    padding: SPACING.MD,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
    marginBottom: SPACING.LG,
  },
  genreTag: {
    backgroundColor: COLORS.CARD_BG,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
  },
  genreText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.SM,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  overview: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
  },
  castCard: {
    width: 100,
    marginRight: SPACING.MD,
  },
  castImage: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
    overflow: "hidden",
  },
  castPlaceholder: {
    backgroundColor: COLORS.CARD_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  castInitial: {
    fontSize: FONT_SIZES.XXL,
    color: COLORS.TEXT_SECONDARY,
  },
  castName: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "600",
  },
  characterName: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
  },
});
