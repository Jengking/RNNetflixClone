import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@my_watchlist';

export interface WatchlistItem {
  id:number,
  title: string,
  poster_path: string | null;
  vote_average: number,
  addedAt:number; // Timestamp when added
}

export const watchlistManager = {
  // Add a movie to watchlist
  add: async (movie: WatchlistItem): Promise<boolean> => {
    try {
      const list = await watchlistManager.getAll();
      const exists = list.some(item => item.id === movie.id);
      
      if (exists) { return false; }

      list.unshift({
        ...movie,
        addedAt: Date.now(),
      });

      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      console.error('Error adding to watchlist', error);
      return false;
    }
  },

  // Remove a movie from watchlist
  remove: async (movieId: number): Promise<boolean> => {
    try {
      const list = await watchlistManager.getAll();
      const filtered = list.filter(item => item.id !== movieId);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  },

  // Get all watchlist items
  getAll: async (): Promise<WatchlistItem[]> => {
    try {
      const data = await AsyncStorage.getItem(WATCHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting watchlist:', error);
      return [];
    }
  },

  // Check if a movie is in watchlist
  isInWatchlist: async (movieId: number): Promise<boolean> => {
    try {
      const list = await watchlistManager.getAll();
      return list.some(item => item.id === movieId);
    } catch (error) {
      console.error('Error checking watchlist:', error);
      return false;
    }
  },

  // Clear entire watchlist
  clear: async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(WATCHLIST_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      return false;
    }
  },

  // Get watchlist items count
  getCount: async (): Promise<number> => {
    try {
      const list = await watchlistManager.getAll();
      return list.length;
    } catch (error) {
      console.error('Error getting watchlist count:', error);
      return 0;
    }
  }
};