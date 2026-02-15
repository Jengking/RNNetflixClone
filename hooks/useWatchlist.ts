import { WatchlistItem, watchlistManager } from "@/utils/watchlist";
import { useCallback, useEffect, useState } from "react";

export function useWatchlist() {
  const [watchList, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    const list = await watchlistManager.getAll();
    setWatchlist(list);
    setLoading(false);
  };

  const addToWatchlist = useCallback(async (movie: WatchlistItem) => {
    const success = await watchlistManager.add(movie);
    if (success) {
      await loadWatchlist();
    }
    return success;
  }, []);

  const removeFromWatchlist = useCallback(async (movieId: number) => {
    const success = await watchlistManager.remove(movieId);
    if (success) {
      await loadWatchlist();
    }
    return success;
  }, []);

  const isInWatchlist = useCallback(
    (movieId: number) => {
      return watchList.some((item) => item.id === movieId);
    },
    [watchList],
  );

  const toggleWatchlist = useCallback(
    async (movie: WatchlistItem) => {
      if (isInWatchlist(movie.id)) {
        return await removeFromWatchlist(movie.id);
      } else {
        return await addToWatchlist(movie);
      }
    },
    [watchList, addToWatchlist, removeFromWatchlist, isInWatchlist],
  );

  return {
    watchList,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    refresh: loadWatchlist,
  };
}
