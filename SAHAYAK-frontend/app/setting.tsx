import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../components/styles/employerSettings";
import { logout } from "@/api/Auth/auth_routes";
import { router } from "expo-router";

export default function EmployerSettingsPage() {
  const navigation = useNavigation();

  const handleNavigation = (route: string) => {
    if (route === "logout") {
      Alert.alert(
        "Confirm Logout",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              logout();
              router.navigate('/login')
            },
          },
        ]
      );
    } else if (route == "WorkerRights") {
      router.push("/workerRights");
    } else if (route == "ChangePassword") {
      router.push("/changePassword");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={26} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => handleNavigation("ChangePassword")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="lock" size={24} color="#FF8C00" />
          </View>
          <Text style={styles.optionText}>Change Password</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="#B0B0B0"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => handleNavigation("WorkerRights")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="gavel" size={24} color="#3498DB" />
          </View>
          <Text style={styles.optionText}>Worker Rights</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="#B0B0B0"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, { borderBottomWidth: 0 }]}
          onPress={() => handleNavigation("logout")}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="logout" size={24} color="#E74C3C" />
          </View>
          <Text style={[styles.optionText, { color: "#E74C3C" }]}>Logout</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="#B0B0B0"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
