import { getImageUrl, IMAGE_SIZES } from "@/api/config";
import { Cast } from "@/types/movie";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from "../constants/theme";

interface CastCardProps {
  actor: Cast;
}

export default function CastCard({ actor }: CastCardProps) {
  const imageUrl = getImageUrl(actor.profile_path, IMAGE_SIZES.PROFILE.MEDIUM);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initial}>{actor.name.charAt(0)}</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={1}>
        {actor.name}
      </Text>
      <Text style={styles.character} numberOfLines={1}>
        {actor.character}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: SPACING.MD,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.CARD_BG,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  initial: {
    fontSize: 36,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "bold",
  },
  name: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "600",
    marginBottom: 2,
  },
  character: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
  },
});
