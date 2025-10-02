import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { getTokens } from '@/api/auth_routes';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkToken = async () => {
      const { accessToken, refreshToken, role } = await getTokens();
      if (accessToken && refreshToken && role){
        setIsLoggedIn(true);
        setRole(role);
      }
      setLoading(false);
    }
    checkToken();
  }, []);

  if (loading) {
    // animation to be added
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {
          isLoggedIn ? (
            <>
            {role === "employer"
            ?
            <Stack.Screen name="(employer)" options={{ headerShown: false }} />
            :
            <Stack.Screen name="(worker)" options={{ headerShown: false }} />
            }
            </>
          )
          :
          ( <Stack.Screen name="(auth)" /> )
        }
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
