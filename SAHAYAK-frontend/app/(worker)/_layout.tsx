import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WorkerProvider } from '@/context/WorkerContext';
import { useEffect, useState } from 'react';
import { getTokens } from '@/api/Auth/auth_routes';
import LoadingIndicator from '@/components/loadingPage';
import { MaterialIcons } from '@expo/vector-icons';

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
    <WorkerProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="insights" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="exclamationmark.triangle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <IconSymbol size={size} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
    </WorkerProvider>
  );
}
