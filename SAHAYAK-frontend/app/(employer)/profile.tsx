import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/components/styles/employer_profile";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { updateEmployerProfile } from "@/api/Employer/profile_routes";
import { LinearGradient } from "expo-linear-gradient";
import { useEmployer } from "@/context/EmployerContext";
import { logout } from "@/api/Auth/auth_routes";
import ReportPopup from "@/components/notificationPages/employerReportNotification";
import { useIsFocused } from "@react-navigation/native";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

interface EditableRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
}

const EditableRow: React.FC<EditableRowProps> = ({
  icon,
  label,
  value,
  onChangeText,
  keyboardType,
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
      />
    </View>
  </View>
);

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { employer, setEmployer } = useEmployer();
  const [username, setUsername] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [reportCount, setReportCount] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  useEffect(() => {
    setUsername(employer ? employer?.username : "");
    setOrganizationName(employer ? employer.org_name : "");
    setEmail(employer ? employer?.email : "");
    setMobileNumber(employer ? employer.contact_number : "");
    setLocation(employer ? employer?.location : "");
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      setIsEditing(false);
      setIsPanelVisible(false);
    }
  }, [isFocused]);

  if (!employer) {
    console.log(employer);
    router.replace("/login");
  }
  const handleSaveChanges = async () => {
    try {
      setIsEditing(false);
      const data = {
        username: username,
        org_name: organizationName,
        email: email,
        contact_number: mobileNumber,
        location: location,
      };
      await updateEmployerProfile(data);
      setEmployer(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUsername(employer?.username || "?");
    setEmail(employer?.email || "?");
    setOrganizationName(employer?.org_name || "?");
    setLocation(employer?.location || "?");
    setMobileNumber(employer?.contact_number || "?");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#1B8A2C", "#145214"]}
          style={styles.profileHeaderGradient}
        >
          <View style={styles.profileHeaderContent}>
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatarText}>
                <MaterialIcons name="business" size={40} color="#2c1616ff" />
              </View>
            </View>

            <View style={styles.profileHeaderTextContainer}>
              <Text style={styles.profileName}>{employer?.org_name}</Text>
              <Text style={styles.profileOrganization}>{employer?.username}</Text>
            </View>

            <View style={styles.headerRightIcons}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setIsPanelVisible(!isPanelVisible)}
              >
                <MaterialIcons name="notifications" size={28} color="#fff" />
                {reportCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{reportCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsMenuVisible(!isMenuVisible)}
              >
                <MaterialIcons name="more-vert" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Information</Text>

            {isEditing ? (
              <>
                <InfoRow
                  icon={<MaterialIcons name="person" size={20} color="#333" />}
                  label="Username"
                  value={username}
                />
                <EditableRow
                  icon={
                    <MaterialIcons name="business" size={20} color="#333" />
                  }
                  label="Organization"
                  value={organizationName}
                  onChangeText={setOrganizationName}
                />
                <InfoRow
                  icon={<MaterialIcons name="email" size={20} color="#333" />}
                  label="Email"
                  value={email}
                />
                <EditableRow
                  icon={<MaterialIcons name="phone" size={20} color="#333" />}
                  label="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                />
                <EditableRow
                  icon={
                    <MaterialIcons name="location-on" size={20} color="#333" />
                  }
                  label="Location"
                  value={location}
                  onChangeText={setLocation}
                />
              </>
            ) : (
              <>
                <InfoRow
                  icon={<MaterialIcons name="person" size={20} color="#333" />}
                  label="Username"
                  value={employer ? employer?.username : ""}
                />
                <InfoRow
                  icon={
                    <MaterialIcons name="business" size={20} color="#333" />
                  }
                  label="Organization"
                  value={employer ? employer?.org_name : ""}
                />
                <InfoRow
                  icon={<MaterialIcons name="email" size={20} color="#333" />}
                  label="Email"
                  value={employer ? employer?.email : ""}
                />
                <InfoRow
                  icon={<MaterialIcons name="phone" size={20} color="#333" />}
                  label="Mobile Number"
                  value={employer ? employer?.contact_number : ""}
                />
                <InfoRow
                  icon={
                    <MaterialIcons name="location-on" size={20} color="#333" />
                  }
                  label="Location"
                  value={employer ? employer?.location : ""}
                />
              </>
            )}
          </View>

          {isEditing ? (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons
                  name="edit"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
        {isMenuVisible && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={() => setIsMenuVisible(false)}
            />
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.push("/attendance-data/filterAttendance");
                }}
              >
                <MaterialIcons name="insert-drive-file" size={20} color="#333" />
                <Text style={styles.menuText}>Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  router.push("/setting");
                }}
              >
                <MaterialIcons name="settings" size={20} color="#333" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsMenuVisible(false);
                  handleLogout();
                }}
              >
                <MaterialIcons name="logout" size={20} color="#E74C3C" />
                <Text style={[styles.menuText, { color: "#E74C3C" }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <ReportPopup
          visible={isPanelVisible}
          onClose={() => setIsPanelVisible(!isPanelVisible)}
          reportCount={reportCount}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
