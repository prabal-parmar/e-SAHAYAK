import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../components/styles/authStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { registerEmployer, registerWorker } from "@/api/Auth/auth_routes";

type Role = "Employer" | "Worker";
type Gender = "Male" | "Female" | "Other";

export default function RegistrationPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [skill, setSkill] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const router = useRouter();

  const emptyForm = () => {
    setUsername("");
    setSelectedRole(null);
    setGender("");
    setFirstName("");
    setLastName("");
    setContactNumber("");
    setSkill("");
    setAddress("");
    setPassword("");
    setEmail("");
    setOrgName("");
  };

  const handelRegisterWorker = async () => {
    const data = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      contactNumber: contactNumber,
      skill: skill,
      address: address,
      username: username.toLowerCase(),
      password: password,
    };
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (username.length < 5) {
      alert("username can-not be less than 5 character");
      return null;
    }

    if (!usernameRegex.test(data.username)) {
      alert("Username doesn't match given requirement. It should include alphabets/numbers and _")
      return null;
    }

    if (
      firstName &&
      lastName &&
      gender &&
      contactNumber &&
      skill &&
      address &&
      username &&
      password &&
      selectedRole === "Worker"
    ) {
      await registerWorker(data);
      emptyForm();
      router.replace("/login");
    } else {
      console.log("All fields are required!");
    }
  };

  const handelRegisterEmployer = async () => {
    const data = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      contactNumber: contactNumber,
      location: address,
      password: password,
      orgName: orgName,
    };

    if (data.username.length < 5) {
      alert("username can-not be less than 5 character");
      return null;
    }

    if (data.contactNumber.length < 10) {
      alert("Mobile Number can only be 10 digit long");
      return null;
    }
    if (
      username &&
      email &&
      contactNumber &&
      address &&
      password &&
      orgName &&
      selectedRole === "Employer"
    ) {
      await registerEmployer(data);
      emptyForm();
      router.replace("/login");
    } else {
      console.log("All fields are required!");
    }
  };

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
            {`Manage compliance, and connect with workers.\nअनुपालन प्रबंधन करें और श्रमिकों से जुड़ें।`}
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
            {`Build your profile, and ensure your rights are protected.\nअपनी प्रोफ़ाइल बनाएँ और सुनिश्चित करें कि आपके अधिकार सुरक्षित हैं।`}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={register.loginButton}
        onPress={() => router.push("/login")}
      >
        <Text style={register.loginButtonText}>
          Already have an account? Login
        </Text>
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
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 40, height: 40 }}
        />
      </View>
      <Text style={register.formTitle}>Create {selectedRole} Account</Text>

      {selectedRole === "Employer" ? (
        <>
          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Organization Name</Text>
            <TextInput
              style={register.input}
              value={orgName}
              onChangeText={setOrgName}
              placeholder="Your company's name"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Tata Constructions Pvt. Ltd."
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Username</Text>
            <TextInput
              style={register.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "rahul123" (letters, numbers, and _ only)
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Email</Text>
            <TextInput
              style={register.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@company.com"
              keyboardType="email-address"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "manager@tatainfra.com"
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Contact Number</Text>
            <TextInput
              style={register.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#B0B8C4"
            />
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Password</Text>
            <TextInput
              style={register.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a strong password"
              secureTextEntry
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Pass@1234" (min 8 chars, include symbols & numbers)
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Location</Text>
            <TextInput
              style={register.input}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g., Indore Vijay Nagar"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Indore Vijay Nagar"
            </Text>
          </View>

          <TouchableOpacity
            style={register.registerButton}
            onPress={handelRegisterEmployer}
          >
            <Text style={register.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={register.splitInputContainer}>
            <View style={{ width: "48%" }}>
              <Text style={register.inputLabel}>First Name</Text>
              <TextInput
                style={register.input}
                placeholder="firstname"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#B0B8C4"
              />
            </View>
            <View style={{ width: "48%" }}>
              <Text style={register.inputLabel}>Last Name</Text>
              <TextInput
                style={register.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="lastname"
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
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#B0B8C4"
            />
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Skill</Text>
            <TextInput
              style={register.input}
              value={skill}
              onChangeText={setSkill}
              placeholder="e.g., Carpenter, Electrician"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Electrician" or "Plumber"
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Address</Text>
            <TextInput
              style={register.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Your current address"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Indore Vijay Nagar"
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Username</Text>
            <TextInput
              style={register.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Choose a username"
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "rahul123" (letters, numbers, and _ only)
            </Text>
          </View>

          <View style={register.inputContainer}>
            <Text style={register.inputLabel}>Password</Text>
            <TextInput
              style={register.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a strong password"
              secureTextEntry
              placeholderTextColor="#B0B8C4"
            />
            <Text style={register.fieldExample}>
              Example: "Pass@1234" (min 8 chars, include symbols & numbers)
            </Text>
          </View>

          <TouchableOpacity
            style={register.registerButton}
            onPress={handelRegisterWorker}
          >
            <Text style={register.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </>
      )}

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
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#FF9933", "#138808"]}
          style={StyleSheet.absoluteFill}
        >
          <ScrollView contentContainerStyle={register.scrollContainer}>
            {selectedRole ? renderRegistrationForm() : renderLandingSelection()}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
