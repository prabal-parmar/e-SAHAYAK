import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { styles } from "@/components/styles/employer_profile";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  getEmployerProfile,
  updateEmployerProfile,
} from "@/api/Employer/profile_routes";
import { LinearGradient } from "expo-linear-gradient";
import { useEmployer } from "@/context/EmployerText";


interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

interface EditableRowProps {
  icon: string;
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
  const {employer, setEmployer} = useEmployer()
  const [username, setUsername] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const handleLogout = () => {
    router.replace("/login");
  };

  const fetchEmployerData = async () => {
    try {
      const data = await getEmployerProfile();
      // console.log(data);
      setUsername(data.username);
      setEmail(data.email);
      setOrganizationName(data.org_name);
      setLocation(data.location);
      setMobileNumber(data.contact_number);
      setEmployer(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployerData();
  }, []);

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
      setEmployer(data)
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
            <Text style={styles.profileName}>{organizationName}</Text>
            <Text style={styles.profileOrganization}>{username}</Text>
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
                icon={<MaterialIcons name="business" size={20} color="#333" />}
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
                value={username}
              />
              <InfoRow
                icon={<MaterialIcons name="business" size={20} color="#333" />}
                label="Organization"
                value={organizationName}
              />
              <InfoRow
                icon={<MaterialIcons name="email" size={20} color="#333" />}
                label="Email"
                value={email}
              />
              <InfoRow
                icon={<MaterialIcons name="phone" size={20} color="#333" />}
                label="Mobile Number"
                value={mobileNumber}
              />
              <InfoRow
                icon={
                  <MaterialIcons name="location-on" size={20} color="#333" />
                }
                label="Location"
                value={location}
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
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={[styles.buttonText, styles.logoutButtonText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
