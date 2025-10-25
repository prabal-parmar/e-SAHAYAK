import { router, Tabs } from "expo-router";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmployerProvider, useEmployer } from "@/context/EmployerContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getTokens } from "@/api/Auth/auth_routes";
import LoadingIndicator from "@/components/loadingPage";
import { getEmployerProfile } from "@/api/Employer/profile_routes";
import { MaterialIcons } from "@expo/vector-icons";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const {employer, setEmployer} = useEmployer()

  const fetchEmployerData = async () => {
    const employerData = await getEmployerProfile()
    if(!employerData){
      setEmployer(null)
      return null;
    }
    setEmployer({
      username: employerData.username,
      org_name: employerData.org_name,
      email: employerData.email,
      location: employerData.location,
      contact_number: employerData.contact_number
    })
  }

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

  useEffect(() => {
    fetchEmployerData()
  }, [])

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  return (
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
              <MaterialIcons name="home" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: "Attendance",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="assignment" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}
