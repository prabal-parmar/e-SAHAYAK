import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../components/styles/changePassword";
import { changeUserPassword } from "@/api/Auth/auth_routes";
import Toast from "react-native-toast-message";

export default function ChangePasswordPage() {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureOld, setSecureOld] = useState(true);
  const [secureNew, setSecureNew] = useState(true);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      Toast.show({
        type: "info",
        text1: "Missing Fields 📝",
        text2: "Please fill in all password fields.",
      });
      return;
    }

    Alert.alert(
      "Confirm Password Change",
      "Are you sure you want to change your password?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Change", style: "destructive", onPress: changePassword },
      ]
    );
  };

  const changePassword = async () => {
    try {
      setLoading(true);
      const response = await changeUserPassword(oldPassword, newPassword);

      if (response) {
        Toast.show({
          type: "success",
          text1: "Password Changed ✅",
          text2: "Your password has been updated successfully.",
        });
        navigation.goBack();
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
      });
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Old Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your old password"
            secureTextEntry={secureOld}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setSecureOld(!secureOld)}>
            <MaterialIcons
              name={secureOld ? "visibility-off" : "visibility"}
              size={22}
              color="#7A869A"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            secureTextEntry={secureNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
            <MaterialIcons
              name={secureNew ? "visibility-off" : "visibility"}
              size={22}
              color="#7A869A"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
