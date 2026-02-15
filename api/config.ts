// api/config.ts
export const API_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: "", // put your TMDB api key here
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
};

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    XLARGE: "w780",
    ORIGINAL: "original",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
  PROFILE: {
    SMALL: "w45",
    MEDIUM: "w185",
    LARGE: "h632",
    ORIGINAL: "original",
  },
  LOGO: {
    SMALL: "w45",
    MEDIUM: "w92",
    LARGE: "w185",
    XLARGE: "w300",
    ORIGINAL: "original",
  },
};

export const getImageUrl = (
  path: string | null,
  size: string = "original",
): string | null => {
  if (!path) return null;
  return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};
