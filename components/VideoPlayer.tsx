import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { COLORS, SPACING } from "../constants/theme";

interface VideoPlayerProps {
  videoKey: string;
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function VideoPlayer({
  videoKey,
  visible,
  onClose,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(true);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={32} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={SCREEN_HEIGHT * 0.3}
            width={SCREEN_WIDTH}
            play={playing}
            videoId={videoKey}
            onChangeState={(state: string) => {
              if (state === "ended") {
                setPlaying(false);
              }
            }}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.infoText}>Tap close when finished watching</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: SPACING.MD,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: SPACING.SM,
  },
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: SPACING.LG,
    alignItems: "center",
  },
  infoText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
});
