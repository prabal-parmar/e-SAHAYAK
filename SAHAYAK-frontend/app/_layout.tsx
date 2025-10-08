import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import { getTokens } from "@/api/Auth/auth_routes";
import { router } from "expo-router";
import LoadingIndicator from "@/components/loadingPage";
import { EmployerProvider } from "@/context/EmployerContext";
import { useWorker, WorkerProvider } from "@/context/WorkerContext";
export const unstable_settings = {
  anchor: "(auth)",
};

type ROLE = string | null;
export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<ROLE>(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkToken = async () => {
      setIsLoggedIn(false);
      setRole(null);

      try {
        const { accessToken, refreshToken, role } = await getTokens();
        if (accessToken && refreshToken && role) {
          setIsLoggedIn(true);
          setRole(role);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/login");
      } else if (role === "employer") {
        router.replace("/(employer)");
      } else if (role === "worker") {
        router.replace("/(worker)");
      }
    }
  }, [isLoggedIn, role, loading]);

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }
  
  return (
    <EmployerProvider>
      <WorkerProvider>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="(auth)" />
        ) : role === "employer" ? (
          <Stack.Screen name="(employer)" />
        ) : (
          <Stack.Screen name="(worker)" />
        )}
      </Stack>
    </ThemeProvider>
      </WorkerProvider>
    </EmployerProvider>
  );
}
