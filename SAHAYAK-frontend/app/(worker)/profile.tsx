import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../components/styles/workerProfile";
import { logout } from "@/api/Auth/auth_routes";
import { router } from "expo-router";
import {
  fetchWorkerProfile,
  updateWorkerProfile,
} from "@/api/Worker/profile_routes";
import { useWorker } from "@/context/WorkerContext";
import Toast from "react-native-toast-message";

type GenderKey = "M" | "F" | "O";

interface WORKER {
  firstName: string;
  lastName: string;
  username: string;
  contactNumber: string;
  gender: GenderKey;
  skill: string;
  address: string;
}

const GENDER_MAP: Record<GenderKey, string> = {
  M: "Male",
  F: "Female",
  O: "Other",
};

const getInitials = (firstName: string, lastName: string) => {
  const first = firstName ? firstName[0] : "";
  const last = lastName ? lastName[0] : "";
  return `${first}${last}`.toUpperCase();
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>{icon}</View>
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
  keyboardType?: "default" | "phone-pad";
}

const EditableRow: React.FC<EditableRowProps> = ({
  icon,
  label,
  value,
  onChangeText,
  keyboardType,
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>{icon}</View>
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

export default function WorkerProfilePage() {
  const { worker, setWorker } = useWorker();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [skill, setSkill] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [gender, setGender] = useState("");

  const updateWorkerData = async () => {
    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        contact_number: contactNumber,
        gender: gender,
        skill: skill,
        address: address,
      };
      await updateWorkerProfile(data);
      let g = gender as GenderKey;
      setWorker({
        firstName,
        lastName,
        contactNumber,
        gender: g,
        skill,
        address,
        username: worker ? worker?.username : "",
      });
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Profile Update Failed",
        text2: "An unexpected error occurred.",
      });
    }
  };

  const fetchWorkerData = async () => {
    try {
      let worker = await fetchWorkerProfile();
      const data: WORKER = {
        firstName: worker.first_name,
        lastName: worker.last_name,
        username: worker.username,
        contactNumber: worker.contact_number,
        gender: worker.gender as GenderKey,
        skill: worker.skill,
        address: worker.address,
      };
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setSkill(data.skill);
      setContactNumber(data.contactNumber);
      setAddress(data.address);
      setGender(data.gender);
      setWorker(data); // Also update context when fetching
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Error Fetching Profile",
        text2: "Unable to load profile data.",
      });
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, [worker?.username]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Do you really want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSettings = () => {
    router.push("/setting");
    setShowMenu(false);
  };

  const handleSaveChanges = async () => {
    // console.log(gender as GenderKey)
    const data: WORKER = {
      firstName: firstName,
      lastName: lastName,
      username: worker ? worker?.username : "",
      contactNumber: contactNumber,
      gender: gender as GenderKey,
      skill: skill,
      address: address,
    };
    setWorker(data);
    await updateWorkerData();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFirstName(worker ? worker?.firstName : "");
    setLastName(worker ? worker?.lastName : "");
    setContactNumber(worker ? worker?.contactNumber : "");
    setAddress(worker ? worker?.address : "");
    setSkill(worker ? worker?.skill : "");
    setGender(worker ? worker?.gender : "O");
    setIsEditing(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
          <LinearGradient
            colors={["#667db6", "#2E2E2E"]}
            style={[styles.headerGradient, { justifyContent: "center" }]}
          >
            <View
              style={[
                styles.headerContent,
                { justifyContent: "space-between", paddingRight: 20 },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {getInitials(
                      worker ? worker?.firstName : "",
                      worker ? worker?.lastName : ""
                    )}
                  </Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.name}>
                    {worker?.firstName} {worker?.lastName}
                  </Text>
                  <Text style={styles.skill}>{worker?.skill}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                <MaterialIcons name="more-vert" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {showMenu && (
            <>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setShowMenu(false)}
              />
              <View style={[styles.menu]}>
                {!isEditing ? (
                  <>
                    <TouchableOpacity
                      onPress={handleSettings}
                      style={styles.menuItem}
                    >
                      <MaterialIcons name="settings" size={20} color="#333" />
                      <Text style={styles.menuItemText}> Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleLogout}
                      style={styles.menuItem}
                    >
                      <MaterialIcons name="logout" size={20} color="#E74C3C" />
                      <Text style={[styles.menuItemText, { color: "#E74C3C" }]}>
                        {" "}
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={handleCancel}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveChanges}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>Save</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              {isEditing ? (
                <>
                  <InfoRow
                    icon={
                      <MaterialIcons name="person" size={24} color="#7A869A" />
                    }
                    label="Username"
                    value={worker?.username || ""}
                  />
                  <EditableRow
                    icon={
                      <MaterialIcons name="badge" size={24} color="#7A869A" />
                    }
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                  <EditableRow
                    icon={
                      <MaterialIcons name="badge" size={24} color="#7A869A" />
                    }
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                  <EditableRow
                    icon={
                      <MaterialIcons name="phone" size={24} color="#7A869A" />
                    }
                    label="Contact Number"
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    keyboardType="phone-pad"
                  />
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconContainer}>
                      <MaterialIcons name="wc" size={24} color="#7A869A" />
                    </View>
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Gender</Text>
                      <View style={styles.genderSelectorContainer}>
                        {(Object.keys(GENDER_MAP) as GenderKey[]).map((key) => (
                          <TouchableOpacity
                            key={key}
                            style={[
                              styles.genderButton,
                              gender === key && styles.genderButtonActive,
                            ]}
                            onPress={() => setGender(key)}
                          >
                            <Text
                              style={[
                                styles.genderButtonText,
                                gender === key && styles.genderButtonTextActive,
                              ]}
                            >
                              {GENDER_MAP[key]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  <EditableRow
                    icon={
                      <MaterialIcons name="home" size={24} color="#7A869A" />
                    }
                    label="Address"
                    value={address || ""}
                    onChangeText={setAddress}
                  />
                  <EditableRow
                    icon={
                      <MaterialIcons name="build" size={24} color="#7A869A" />
                    }
                    label="Primary Skill"
                    value={skill || ""}
                    onChangeText={setSkill}
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    icon={
                      <MaterialIcons name="person" size={24} color="#7A869A" />
                    }
                    label="Username"
                    value={worker?.username || ""}
                  />
                  <InfoRow
                    icon={
                      <MaterialIcons name="phone" size={24} color="#7A869A" />
                    }
                    label="Contact Number"
                    value={worker?.contactNumber || ""}
                  />
                  <InfoRow
                    icon={<MaterialIcons name="wc" size={24} color="#7A869A" />}
                    label="Gender"
                    value={GENDER_MAP[worker?.gender || "O"]}
                  />
                  <InfoRow
                    icon={
                      <MaterialIcons name="home" size={24} color="#7A869A" />
                    }
                    label="Address"
                    value={worker?.address || ""}
                  />
                  <InfoRow
                    icon={
                      <MaterialIcons name="build" size={24} color="#7A869A" />
                    }
                    label="Primary Skill"
                    value={worker?.skill || ""}
                  />
                </>
              )}
            </View>

            {isEditing ? (
              <View style={[styles.actionsContainer, {paddingBottom: "15%"}]}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.buttonText}>Save</Text>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
