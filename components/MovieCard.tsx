import { getImageUrl, IMAGE_SIZES } from "@/api/config";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { watchlistManager } from "../utils/watchlist";

interface MovieCardProps {
  movie: Movie;
  width?: number;
  height?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 1.5;
const CARD_HEIGHT = SCREEN_WIDTH * 1;

export default function MovieCard({
  movie,
  width = CARD_WIDTH,
  height = CARD_HEIGHT,
}: MovieCardProps) {
  const router = useRouter();
  const imageUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.POSTER.MEDIUM);
  //Track if in watchlist
  const [inWatchlist, setInWatchlist] = useState(false);

  // Check watchlist status on mount
  useEffect(() => {
    checkWatchlist();
  }, [movie.id]);

  // Function to check if movie is in watchlist
  const checkWatchlist = async () => {
    const isInList = await watchlistManager.isInWatchlist(movie.id);
    setInWatchlist(isInList);
  };

  const handlePress = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width, height }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { width, height }]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            ⭐ {movie.vote_average.toFixed(1)}
          </Text>
        </View>

        {/* Watchlist indicator */}
        {inWatchlist && (
          <View style={styles.watchlistBadge}>
            <Ionicons name="bookmark" size={16} color={COLORS.PRIMARY} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
    backgroundColor: COLORS.CARD_BG,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.CARD_BG,
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SM,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.SM,
  },
  rating: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    alignSelf: "flex-start",
  },
  ratingText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.XS,
    fontWeight: "600",
  },
  watchlistBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 4,
    borderRadius: BORDER_RADIUS.SM,
  },
});
