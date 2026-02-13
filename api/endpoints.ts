import tmdbClient from './client';
import {
  Movie,
  MovieDetails,
  TVShow,
  TVShowDetails,
  Video,
  Cast,
  Crew,
} from '../types/movie';
import { ApiResponse, TMDBResponse, VideoResponse, CreditsResponse } from '../types/api';

// Helper function to wrap API calls
async function apiCall<T>(
  request: () => Promise<any>
): Promise<ApiResponse<T>> {
  try {
    const response = await request();
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.status_message || error.message || 'An error occurred',
    };
  }
}

// ========== MOVIE ENDPOINTS ==========

export const movieApi = {
  // Get popular movies
  getPopular: (page: number = 1): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() => tmdbClient.get('/movie/popular', { params: { page } }));
  },

  // Get top rated movies
  getTopRated: (page: number = 1): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() => tmdbClient.get('/movie/top_rated', { params: { page } }));
  },

  // Get now playing movies
  getNowPlaying: (page: number = 1): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() => tmdbClient.get('/movie/now_playing', { params: { page } }));
  },

  // Get upcoming movies
  getUpcoming: (page: number = 1): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() => tmdbClient.get('/movie/upcoming', { params: { page } }));
  },

  // Get trending movies (day or week)
  getTrending: (
    timeWindow: 'day' | 'week' = 'day',
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() =>
      tmdbClient.get(`/trending/movie/${timeWindow}`, { params: { page } })
    );
  },

  // Get movie details
  getDetails: (movieId: number): Promise<ApiResponse<MovieDetails>> => {
    return apiCall(() =>
      tmdbClient.get(`/movie/${movieId}`, {
        params: { append_to_response: 'videos,credits' },
      })
    );
  },

  // Get movie videos (trailers, teasers, etc.)
  getVideos: (movieId: number): Promise<ApiResponse<VideoResponse>> => {
    return apiCall(() => tmdbClient.get(`/movie/${movieId}/videos`));
  },

  // Get movie credits (cast and crew)
  getCredits: (movieId: number): Promise<ApiResponse<CreditsResponse>> => {
    return apiCall(() => tmdbClient.get(`/movie/${movieId}/credits`));
  },

  // Get similar movies
  getSimilar: (
    movieId: number,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() =>
      tmdbClient.get(`/movie/${movieId}/similar`, { params: { page } })
    );
  },

  // Get movie recommendations
  getRecommendations: (
    movieId: number,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() =>
      tmdbClient.get(`/movie/${movieId}/recommendations`, { params: { page } })
    );
  },

  // Search movies
  search: (
    query: string,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() =>
      tmdbClient.get('/search/movie', { params: { query, page } })
    );
  },

  // Discover movies with filters
  discover: (params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    year?: number;
    'vote_average.gte'?: number;
  }): Promise<ApiResponse<TMDBResponse<Movie>>> => {
    return apiCall(() => tmdbClient.get('/discover/movie', { params }));
  },
};

// ========== TV SHOW ENDPOINTS ==========

export const tvApi = {
  // Get popular TV shows
  getPopular: (page: number = 1): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() => tmdbClient.get('/tv/popular', { params: { page } }));
  },

  // Get top rated TV shows
  getTopRated: (page: number = 1): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() => tmdbClient.get('/tv/top_rated', { params: { page } }));
  },

  // Get TV shows airing today
  getAiringToday: (page: number = 1): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() => tmdbClient.get('/tv/airing_today', { params: { page } }));
  },

  // Get TV shows on the air
  getOnTheAir: (page: number = 1): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() => tmdbClient.get('/tv/on_the_air', { params: { page } }));
  },

  // Get trending TV shows
  getTrending: (
    timeWindow: 'day' | 'week' = 'day',
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() =>
      tmdbClient.get(`/trending/tv/${timeWindow}`, { params: { page } })
    );
  },

  // Get TV show details
  getDetails: (tvId: number): Promise<ApiResponse<TVShowDetails>> => {
    return apiCall(() =>
      tmdbClient.get(`/tv/${tvId}`, {
        params: { append_to_response: 'videos,credits' },
      })
    );
  },

  // Get TV show videos
  getVideos: (tvId: number): Promise<ApiResponse<VideoResponse>> => {
    return apiCall(() => tmdbClient.get(`/tv/${tvId}/videos`));
  },

  // Get TV show credits
  getCredits: (tvId: number): Promise<ApiResponse<CreditsResponse>> => {
    return apiCall(() => tmdbClient.get(`/tv/${tvId}/credits`));
  },

  // Get similar TV shows
  getSimilar: (
    tvId: number,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() => tmdbClient.get(`/tv/${tvId}/similar`, { params: { page } }));
  },

  // Search TV shows
  search: (
    query: string,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<TVShow>>> => {
    return apiCall(() =>
      tmdbClient.get('/search/tv', { params: { query, page } })
    );
  },
};

// ========== GENRE ENDPOINTS ==========

export const genreApi = {
  // Get movie genres
  getMovieGenres: (): Promise<ApiResponse<{ genres: Genre[] }>> => {
    return apiCall(() => tmdbClient.get('/genre/movie/list'));
  },

  // Get TV genres
  getTVGenres: (): Promise<ApiResponse<{ genres: Genre[] }>> => {
    return apiCall(() => tmdbClient.get('/genre/tv/list'));
  },
};

import { Genre } from '../types/movie';

// ========== SEARCH ENDPOINTS ==========

export const searchApi = {
  // Multi search (movies, TV shows, people)
  multi: (
    query: string,
    page: number = 1
  ): Promise<ApiResponse<TMDBResponse<any>>> => {
    return apiCall(() =>
      tmdbClient.get('/search/multi', { params: { query, page } })
    );
  },
};