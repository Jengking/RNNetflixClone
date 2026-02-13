import { Movie } from "@/types/movie";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  list: {
    paddingLeft: SPACING.MD,
  },
});
