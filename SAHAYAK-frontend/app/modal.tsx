import { Link, useRouter } from "expo-router";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LinearGradient } from "expo-linear-gradient";

const LANDING_PAGE_GRADIENT = ["#FF9933", "#138808"];

export default function ModalScreen() {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={LANDING_PAGE_GRADIENT}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.contentWrapper}>
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 60, height: 60 }}
        />
        <Text style={styles.title}>SRAM</Text>
        <Text style={styles.subtitle}>Sramik Rights & Account Management</Text>

        <View style={styles.linksContainer}>
          <Link href="/login" dismissTo style={styles.linkCard}>
            <ThemedText style={styles.linkCard}>
              <Text style={styles.linkIcon}>➡️</Text>
              <Text style={styles.linkText}>Login</Text>
            </ThemedText>
          </Link>

          <Link href="/register" dismissTo style={styles.linkCard}>
            <ThemedText style={styles.linkCard}>
              <Text style={styles.linkIcon}>👤</Text>
              <Text style={styles.linkText}>Register</Text>
            </ThemedText>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  title: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
    fontWeight: "500",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  linkCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  linkIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#000080",
  },
  linkText: {
    color: "#000080",
    fontSize: 16,
    fontWeight: "bold",
  },
});
