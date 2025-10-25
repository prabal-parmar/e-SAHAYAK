import { Tabs } from 'expo-router';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorker, WorkerProvider } from '@/context/WorkerContext';
import { useEffect, useState } from 'react';
import { getTokens } from '@/api/Auth/auth_routes';
import LoadingIndicator from '@/components/loadingPage';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchWorkerProfile } from '@/api/Worker/profile_routes';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const {worker, setWorker} = useWorker()

  const fetchWorkerData = async () => {
    const workerData = await fetchWorkerProfile()
    setWorker(
      {firstName: workerData?.first_name,
      lastName: workerData?.last_name,
      username: workerData?.username,
      contactNumber: workerData?.contact_number,
      gender: workerData?.gender,
      skill: workerData?.skill,
      address: workerData?.address})
  }
  useEffect(() => {
    const verifyAuth = async () => {
      const { accessToken, refreshToken, role } = await getTokens();

      if (accessToken && refreshToken && role === "employer") {
        setIsAuthorized(true);
      }
      setLoading(false);
    };
    fetchWorkerData()
    verifyAuth();
  }, []);
  
  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  return (
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
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => <MaterialIcons name="warning" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
