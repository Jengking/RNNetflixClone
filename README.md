# 🎬 Netflix Clone - React Native

A fully functional Netflix-style streaming app built with React Native, Expo, and TypeScript, powered by The Movie Database (TMDB) API.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

---

## 📱 Features

### ✅ Implemented

- **Browse Movies** - Multiple categories (Trending, Popular, Top Rated, Now Playing, Upcoming)
- **Movie Details** - Complete information with cast, crew, trailers, and similar movies
- **Video Trailers** - Watch movie trailers with YouTube integration
- **Search** - Search for movies and TV shows with real-time results
- **My List** - Save favorite movies with persistent storage
- **Responsive Design** - Netflix-style UI with beautiful gradients and animations
- **Safe Area Support** - Proper handling of device notches and navigation bars

### 🎨 UI/UX Features

- Hero section with backdrop images
- Horizontal scrolling movie rows
- Grid layout for search results
- Pull-to-refresh on all screens
- Loading states and error handling
- Empty states with helpful messages
- Confirmation dialogs
- Visual indicators (ratings, watchlist badges)

---

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **API:** The Movie Database (TMDB) API
- **State Management:** React Hooks (useState, useEffect, custom hooks)
- **Storage:** AsyncStorage for persistent data
- **Video Player:** react-native-youtube-iframe
- **Icons:** @expo/vector-icons (Ionicons)
- **Gradients:** expo-linear-gradient
- **Safe Area:** react-native-safe-area-context

---

## 📂 Project Structure

```
netflix-clone/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   ├── config.ts          # API configuration and image helpers
│   └── endpoints.ts       # API endpoint functions
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx    # Tab navigation layout
│   │   ├── index.tsx      # Home screen (Browse)
│   │   ├── explore.tsx    # Search screen
│   │   ├── mylist.tsx     # My List screen
│   │   └── profile.tsx    # Profile screen
│   ├── movie/
│   │   └── [id].tsx       # Movie detail screen
│   └── _layout.tsx        # Root layout
├── components/
│   ├── CastCard.tsx       # Actor card component
│   ├── ErrorMessage.tsx   # Error display component
│   ├── HeroSection.tsx    # Hero banner component
│   ├── InfoRow.tsx        # Detail info row component
│   ├── LoadingSpinner.tsx # Loading indicator
│   ├── MovieCard.tsx      # Movie poster card
│   ├── MovieRow.tsx       # Horizontal movie list
│   └── VideoPlayer.tsx    # YouTube video modal
├── constants/
│   └── theme.ts           # App colors, spacing, fonts
├── hooks/
│   ├── useApi.ts          # API data fetching hook
│   └── useWatchlist.ts    # Watchlist management hook
├── types/
│   ├── api.ts             # API response types
│   ├── movie.ts           # Movie-related types
│   └── tv.ts              # TV show types
├── utils/
│   └── watchlist.ts       # Watchlist storage manager
├── .gitignore
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/netflix-clone.git
   cd netflix-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Get TMDB API Key**
   - Go to [TMDB Website](https://www.themoviedb.org/)
   - Create a free account
   - Navigate to Settings → API
   - Request an API key (instant approval)

4. **Configure API Key**

   Open `api/config.ts` and add your API key:

   ```typescript
   export const API_CONFIG = {
     BASE_URL: "https://api.themoviedb.org/3",
     API_KEY: "YOUR_API_KEY_HERE", // 👈 Add your key here
     IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
   };
   ```

5. **Start the development server**

   ```bash
   npx expo start
   ```

6. **Run on your device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

---

## 📱 Screenshots

### Home Screen

Browse trending, popular, and top-rated movies with Netflix-style horizontal scrolling.

### Movie Details

View complete movie information including cast, trailers, budget, revenue, and similar recommendations.

### Search

Real-time search with grid layout for movies and TV shows.

### My List

Save and manage your favorite movies with persistent storage.

---

## 🎯 Features Deep Dive

### 1. Movie Browsing

- **Categories:** Trending, Popular, Top Rated, Now Playing, Upcoming
- **Hero Section:** Large featured movie with play button
- **Horizontal Scrolling:** Smooth scroll through movie categories
- **Ratings:** Star ratings displayed on each card

### 2. Movie Details

- **Information:** Title, tagline, overview, genres, runtime
- **Cast & Crew:** Horizontal scrolling cast cards with photos
- **Videos:** Multiple trailers and clips
- **Details:** Release date, budget, revenue, production companies
- **Recommendations:** Similar movies section

### 3. Video Playback

- **YouTube Integration:** Play official trailers
- **Full-Screen Modal:** Immersive viewing experience
- **Multiple Videos:** Browse all available trailers and clips

### 4. Search

- **Real-Time Search:** Results update as you type
- **Multi-Type Results:** Movies and TV shows
- **Grid Layout:** 3-column responsive grid
- **Empty States:** Helpful messages for no results

### 5. My List

- **Add/Remove:** One-tap save to watchlist
- **Persistent Storage:** Saves between app sessions using AsyncStorage
- **Visual Indicators:** Bookmark icon on saved movies
- **Bulk Actions:** Clear all movies at once
- **Pull-to-Refresh:** Reload your list

---

## 🔧 Configuration

### Theme Customization

Edit `constants/theme.ts` to customize colors, spacing, and fonts:

```typescript
export const COLORS = {
  PRIMARY: "#E50914", // Netflix Red
  SECONDARY: "#B81D24",
  BACKGROUND: "#141414",
  CARD_BG: "#2F2F2F",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#B3B3B3",
  ACCENT: "#00A8E8",
};
```

### API Configuration

Modify `api/config.ts` for different image sizes or API settings:

```typescript
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    ORIGINAL: "original",
  },
  // ... more sizes
};
```

---

## 📚 API Documentation

This app uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).

### Key Endpoints Used:

- `/movie/popular` - Popular movies
- `/movie/top_rated` - Top rated movies
- `/movie/{id}` - Movie details
- `/movie/{id}/videos` - Movie trailers
- `/movie/{id}/credits` - Cast and crew
- `/search/multi` - Search movies and TV shows
- `/trending/movie/{time_window}` - Trending movies

---

## 🧪 Testing

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Clear cache and restart
npx expo start -c
```

---

## 📦 Building for Production

### Android APK

```bash
eas build --platform android --profile preview
```

### iOS IPA

```bash
eas build --platform ios --profile preview
```

### App Store / Play Store

```bash
eas build --platform all --profile production
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot resolve '@env'"

**Solution:** Remove the `@env` import and use direct configuration in `api/config.ts`

### Issue: Bottom tabs hidden behind navigation bar

**Solution:** Install `react-native-safe-area-context` and use `useSafeAreaInsets()` in tab layout

### Issue: YouTube videos not playing

**Solution:** Make sure `react-native-webview` is installed: `npx expo install react-native-webview`

### Issue: Images not loading

**Solution:** Check your API key is correct and you have internet connection

---

## 🎨 Design Decisions

### Why Expo Router?

- File-based routing (similar to Next.js)
- Easy navigation setup
- TypeScript support out of the box
- Great developer experience

### Why AsyncStorage for My List?

- Simple key-value storage
- Perfect for small amounts of data
- Persistent between app sessions
- No backend required

### Why TMDB API?

- Free tier with generous limits
- Comprehensive movie database
- High-quality images
- Official trailers and videos

---

## 🚀 Future Enhancements

### Planned Features

- [ ] TV Shows section with seasons and episodes
- [ ] Genre filtering and discovery
- [ ] Continue watching with progress tracking
- [ ] User profiles with separate watchlists
- [ ] Push notifications for new releases
- [ ] Download for offline viewing
- [ ] Social features (share, rate, review)
- [ ] Dark/Light theme toggle
- [ ] Advanced search filters
- [ ] Chromecast support

### Performance Optimizations

- [ ] Image caching
- [ ] Lazy loading for long lists
- [ ] Pagination for API calls
- [ ] Memoization of expensive components
- [ ] Code splitting

---

## 📝 Learning Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TMDB API Documentation](https://developer.themoviedb.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the API
- [Netflix](https://www.netflix.com/) for design inspiration
- [Expo](https://expo.dev/) for the amazing development platform
- React Native community for excellent libraries and support

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and React Native**
