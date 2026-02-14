import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getImageUrl, IMAGE_SIZES } from "../../api/config";
import { movieApi } from "../../api/endpoints";
import CastCard from "../../components/CastCard";
import InfoRow from "../../components/InfoRow";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieRow from "../../components/MovieRow";
import VideoPlayer from "../../components/VideoPlayer";
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
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState<string>("");

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

  const handlePlayTrailer = (videoKey: string) => {
    setSelectedVideoKey(videoKey);
    setShowVideoPlayer(true);
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !movie) {
    return <LoadingSpinner />;
  }

  const backdropUrl = getImageUrl(
    movie.backdrop_path,
    IMAGE_SIZES.BACKDROP.ORIGINAL,
  );
  const posterUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.POSTER.LARGE);
  const trailer = videos.find((v) => v.type === "Trailer") || videos[0];
  const director = cast.find((c) => c.character === "Director");

  return (
    <>
      <ScrollView style={styles.container}>
        {/*Hero Section with Backdrop */}
        <ImageBackground
          source={{ uri: backdropUrl || posterUrl || undefined }}
          style={styles.backdrop}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["transparent", "rgba(20, 20, 20, 0.7)", COLORS.BACKGROUND]}
            style={styles.gradient}
          >
            {/*Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color={COLORS.TEXT_PRIMARY}
              />
            </TouchableOpacity>

            <View style={styles.heroContent}>
              {/*Movie Poster 
              {posterUrl && (
                <ImageBackground
                  source={{ uri: posterUrl }}
                  style={styles.poster}
                  imageStyle={styles.posterImage}
                />
              )}*/}

              {/* Title and Basic Info */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>{movie.title}</Text>
                {movie.tagline && (
                  <Text style={styles.tagline}>
                    &quot;{movie.tagline}&quot;
                  </Text>
                )}

                <View style={styles.metaInfo}>
                  {/*Rating badge with better styling */}
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {movie.vote_average.toFixed(1)}
                    </Text>
                  </View>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  {/*Formatted runtime */}
                  <Text style={styles.metaText}>
                    {formatRuntime(movie.runtime)}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/*Action Buttons Section */}
        <View style={styles.actionButtons}>
          {/*Watch Trailer button */}
          {trailer && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handlePlayTrailer(trailer.key)}
            >
              <Ionicons name="play" size={24} color={COLORS.BACKGROUND} />
              <Text style={styles.playButtonText}>Watch Trailer</Text>
            </TouchableOpacity>
          )}

          {/*My List button (placeholder for now) */}
          <TouchableOpacity style={styles.listButton}>
            <Ionicons name="add" size={24} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.listButtonText}>My List</Text>
          </TouchableOpacity>

          {/*Share button */}
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons
              name="share-outline"
              size={24}
              color={COLORS.TEXT_PRIMARY}
            />
          </TouchableOpacity>
        </View>

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

          {/*Movie Details Section with InfoRow components */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <InfoRow
              icon="📅"
              label="Release Date"
              value={new Date(movie.release_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <InfoRow
              icon="⏱️"
              label="Runtime"
              value={formatRuntime(movie.runtime)}
            />
            <InfoRow
              icon="💰"
              label="Budget"
              value={
                movie.budget > 0 ? formatMoney(movie.budget) : "Not disclosed"
              }
            />
            <InfoRow
              icon="💵"
              label="Revenue"
              value={
                movie.revenue > 0 ? formatMoney(movie.revenue) : "Not available"
              }
            />
            <InfoRow icon="🎬" label="Status" value={movie.status} />
          </View>

          {/*Videos Section - Shows all trailers/clips */}
          {videos.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Videos & Trailers</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {videos.map((video) => (
                  <TouchableOpacity
                    key={video.id}
                    style={styles.videoCard}
                    onPress={() => handlePlayTrailer(video.key)}
                  >
                    <View style={styles.videoThumbnail}>
                      <Ionicons
                        name="play-circle"
                        size={48}
                        color={COLORS.PRIMARY}
                      />
                    </View>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.name}
                    </Text>
                    <Text style={styles.videoType}>{video.type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/*Cast Section using FlatList and CastCard component */}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <FlatList
                data={cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <CastCard actor={item} />}
              />
            </View>
          )}

          {/*Production Companies */}
          {movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production</Text>
              <View style={styles.companiesContainer}>
                {movie.production_companies.map((company) => (
                  <Text key={company.id} style={styles.companyText}>
                    {company.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View style={styles.similarSection}>
              <MovieRow title="More Like This" movies={similarMovies} />
            </View>
          )}
        </View>
      </ScrollView>
      {selectedVideoKey && (
        <VideoPlayer
          videoKey={selectedVideoKey}
          visible={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  backdrop: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
  },
  gradient: {
    flex: 1,
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: SPACING.MD,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: SPACING.SM,
  },
  heroContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  poster: {
    width: 120,
    height: 180,
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  posterImage: {
    borderRadius: BORDER_RADIUS.MD,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    flexWrap: "wrap",
  },
  ratingBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
  ratingText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: "bold",
  },
  metaDot: {
    color: COLORS.TEXT_SECONDARY,
    marginHorizontal: SPACING.SM,
    fontSize: FONT_SIZES.LG,
  },
  metaText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    padding: SPACING.MD,
    gap: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
  },
  playButton: {
    flex: 1,
    backgroundColor: COLORS.TEXT_PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.SM,
  },
  playButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
  listButton: {
    flex: 1,
    backgroundColor: COLORS.CARD_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.SM,
  },
  listButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
  shareButton: {
    backgroundColor: COLORS.CARD_BG,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
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
    fontWeight: "500",
  },
  section: {
    marginBottom: SPACING.XL,
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
  videoCard: {
    width: 200,
    marginRight: SPACING.MD,
  },
  videoThumbnail: {
    width: 200,
    height: 112,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: BORDER_RADIUS.MD,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  videoTitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "600",
    marginBottom: 4,
  },
  videoType: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  companiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  companyText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  similarSection: {
    marginTop: SPACING.LG,
    marginLeft: -SPACING.MD,
    marginRight: -SPACING.MD,
  },
});
