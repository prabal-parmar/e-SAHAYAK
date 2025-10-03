import { logout } from "@/api/Auth/auth_routes";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const index = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/modal");
  };
  return (
    <View>
      <Text>This is Employer Home page</Text>
      <Text style={{ marginTop: 30 }} onPress={handleLogout}>
        Logout
      </Text>
    </View>
  );
};

export default index;
