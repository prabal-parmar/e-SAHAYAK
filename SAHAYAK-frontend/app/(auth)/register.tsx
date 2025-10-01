import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "./styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";

type Role = "Employer" | "Worker";
type Gender = "Male" | "Female" | "Other";

export default function RegistrationPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);

  const renderLandingSelection = () => (
    <View style={register.landingContainer}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={register.landingLogo}
        resizeMode="contain"
      />
      <Text style={register.mainTitle}>Join the Platform</Text>
      <Text style={register.description}>
        Choose the role that best describes you to get started.
      </Text>

      <TouchableOpacity
        style={register.roleCard}
        onPress={() => setSelectedRole("Employer")}
      >
        <View style={register.cardIconContainer}>
          <Text style={register.cardIcon}>
            <FontAwesome5 name="briefcase" size={32} color="#fff" />
          </Text>
        </View>
        <View style={register.cardTextContainer}>
          <Text style={register.cardTitle}>Register as Employer</Text>
          <Text style={register.cardDescription}>
            Manage compliance, and connect with workers.
            <br/>
            अनुपालन प्रबंधन करें और श्रमिकों से जुड़ें।
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={register.roleCard}
        onPress={() => setSelectedRole("Worker")}
      >
        <View style={register.cardIconContainer}>
          <Text style={register.cardIcon}>
            <FontAwesome5 name="users" size={32} color="#fff" />
          </Text>
        </View>
        <View style={register.cardTextContainer}>
          <Text style={register.cardTitle}>Register as Worker</Text>
          <Text style={register.cardDescription}>
            Build your profile, and ensure your rights are protected.
            <br/>
            अपनी प्रोफ़ाइल बनाएँ और सुनिश्चित करें कि आपके अधिकार सुरक्षित हैं।
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderRegistrationForm = () => (
    <View style={register.formContainer}>
      <TouchableOpacity
        onPress={() => setSelectedRole(null)}
        style={register.backButton}
      >
        <Text style={register.backButtonText}>‹ Change Role</Text>
      </TouchableOpacity>

      <Text style={register.formTitle}>Create {selectedRole} Account</Text>

      {selectedRole === "Employer" ? (
        <>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Username</Text>
            <TextInput
              style={register.input}
              placeholder="Choose a username"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Email</Text>
            <TextInput
              style={register.input}
              placeholder="your.email@company.com"
              keyboardType="email-address"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Contact Number</Text>
            <TextInput
              style={register.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Password</Text>
            <TextInput
              style={register.input}
              placeholder="Create a strong password"
              secureTextEntry
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Organization Name</Text>
            <TextInput
              style={register.input}
              placeholder="Your company's name"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Location</Text>
            <TextInput
              style={register.input}
              placeholder="e.g., Mumbai, Maharashtra"
              placeholderTextColor="#B0B8C4"
            />
          </View>
        </>
      ) : (
        <>
          <View style={register.splitInputContainer}>
            <View style={{ width: "48%" }}>
              <Text style={register.inputLabel}>First Name</Text>
              <TextInput
                style={register.input}
                placeholder="Ramesh"
                placeholderTextColor="#B0B8C4"
              />
            </View>
            <View style={{ width: "48%" }}>
              <Text style={register.inputLabel}>Last Name</Text>
              <TextInput
                style={register.input}
                placeholder="Singh"
                placeholderTextColor="#B0B8C4"
              />
            </View>
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Gender</Text>
            <View style={register.genderContainer}>
              {(["Male", "Female", "Other"] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    register.genderButton,
                    gender === g && register.genderButtonActive,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      register.genderButtonText,
                      gender === g && register.genderButtonTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Contact Number</Text>
            <TextInput
              style={register.input}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Skill</Text>
            <TextInput
              style={register.input}
              placeholder="e.g., Carpenter, Electrician"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Address</Text>
            <TextInput
              style={register.input}
              placeholder="Your current address"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Username</Text>
            <TextInput
              style={register.input}
              placeholder="Choose a username"
              placeholderTextColor="#B0B8C4"
            />
          </View>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Password</Text>
            <TextInput
              style={register.input}
              placeholder="Create a strong password"
              secureTextEntry
              placeholderTextColor="#B0B8C4"
            />
          </View>
        </>
      )}

      <TouchableOpacity style={register.registerButton}>
        <Text style={register.registerButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={register.loginContainer}>
        <Text style={register.loginText}>Already have an account?</Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={register.loginLink}>Login here</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FF9933" }}>
        <LinearGradient colors={["#FF9933", "#138808"]} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={register.scrollContainer}>
            {selectedRole ? renderRegistrationForm() : renderLandingSelection()}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
