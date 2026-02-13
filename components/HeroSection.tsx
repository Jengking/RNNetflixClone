import { getImageUrl, IMAGE_SIZES } from "@/api/config";
import { Movie } from "@/types/movie";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";

interface HeroSectionProps {
  movie: Movie;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HeroSection({ movie }: HeroSectionProps) {
  const router = useRouter();
  const imageUrl = getImageUrl(
    movie.backdrop_path,
    IMAGE_SIZES.BACKDROP.ORIGINAL,
  );

  const handlePlay = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUrl || undefined }}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(20, 20, 0.8)", COLORS.BACKGROUND]}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.overview} numberOfLines={3}>
              {movie.overview}
            </Text>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
                <Text style={styles.playButtonText}>▶ Play</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoButton} onPress={handlePlay}>
                <Text style={styles.infoButtonText}>ℹ More Info</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.6,
    marginBottom: SPACING.LG,
  },
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  overview: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: "row",
    gap: SPACING.MD,
  },
  playButton: {
    flex: 1,
    backgroundColor: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 4,
    alignItems: "center",
  },
  playButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
  infoButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: SPACING.MD,
    borderRadius: 4,
    alignItems: "center",
  },
  infoButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
});
