import { router, Tabs } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmployerProvider } from "@/context/EmployerContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getTokens } from "@/api/Auth/auth_routes";
import LoadingIndicator from "@/components/loadingPage";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const { accessToken, refreshToken, role } = await getTokens();

      if (accessToken && refreshToken && role === "employer") {
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  return (
    <EmployerProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: "Attendance",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="list.bullet.clipboard"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </EmployerProvider>
  );
}
