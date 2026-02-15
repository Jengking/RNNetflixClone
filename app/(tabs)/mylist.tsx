import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieCard from "../../components/MovieCard";
import { COLORS, FONT_SIZES, SPACING } from "../../constants/theme";
import { useWatchlist } from "../../hooks/useWatchlist";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const CARD_SPACING = SPACING.SM;
const TOTAL_SPACING = SPACING.MD * 2 + CARD_SPACING * (NUM_COLUMNS - 1);
const CARD_WIDTH = (SCREEN_WIDTH - TOTAL_SPACING) / NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function MyListScreen() {
  const router = useRouter();
  const { watchList, loading, removeFromWatchlist, refresh } = useWatchlist();

  const handleRemove = (movieId: number, title: string) => {
    Alert.alert("Remove from My List", `Remove "${title}" from your list?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await removeFromWatchlist(movieId);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear My List",
      "Are you sure you want to remove all movies from your list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            for (const item of watchList) {
              await removeFromWatchlist(item.id);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Watchlist</Text>
          <Text style={styles.subtitle}>
            {watchList.length} {watchList.length === 1 ? "movie" : "movies"}
          </Text>
        </View>

        {watchList.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State */}
      {watchList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="bookmark-outline"
            size={80}
            color={COLORS.TEXT_SECONDARY}
          />
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>
            Add movies you want to watch by tapping the + button
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Movie Grid
        <FlatList
          data={watchList}
          numColumns={NUM_COLUMNS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            const isLastInRow = (index + 1) % NUM_COLUMNS === 0;
            return (
              <View
                style={[styles.cardWrapper, !isLastInRow && styles.cardMargin]}
              >
                <MovieCard
                  movie={item as any}
                  width={CARD_WIDTH}
                  height={CARD_HEIGHT}
                />
                {/* Remove button overlay */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.id, item.title)}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={COLORS.PRIMARY}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          contentContainerStyle={styles.grid}
          onRefresh={refresh}
          refreshing={loading}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.MD,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BG,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  clearButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  clearButtonText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: "600",
  },
  grid: {
    padding: SPACING.MD,
    paddingTop: SPACING.SM,
  },
  cardWrapper: {
    marginBottom: SPACING.MD,
    position: "relative",
  },
  cardMargin: {
    marginRight: CARD_SPACING,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.XL,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SPACING.XL,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
  },
  browseButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: "bold",
  },
});
