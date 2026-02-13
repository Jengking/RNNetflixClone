import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { searchApi } from "../../api/endpoints";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieCard from "../../components/MovieCard";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  SPACING,
} from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.3;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const response = await searchApi.multi(text);
    if (response.success && response.data) {
      setResults(response.data.results);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies, TV shows..."
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          numColumns={3}
          keyExtractor={(item) => `${item.media_type}-${item.id}`}
          renderItem={({ item }) => {
            if (item.media_type === "movie" || item.media_type === "tv") {
              return (
                <View style={styles.cardWrapper}>
                  <MovieCard
                    movie={item}
                    width={CARD_WIDTH}
                    height={CARD_WIDTH * 1.5}
                  />
                </View>
              );
            }
            return null;
          }}
          contentContainerStyle={styles.grid}
        />
      ) : query.length > 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No results found for `${query}`</Text>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Search for movies and TV shows</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: SPACING.MD,
    paddingTop: 60,
  },
  searchInput: {
    backgroundColor: COLORS.CARD_BG,
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.MD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  grid: {
    padding: SPACING.SM,
  },
  cardWrapper: {
    flex: 1 / 3,
    padding: SPACING.XS,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
  },
});
