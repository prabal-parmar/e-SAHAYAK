import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { landingStyles, loginStyles } from "../../components/styles/authStyles";
import { employerLogin, workerLogin } from "@/api/Auth/auth_routes";
import Toast from "react-native-toast-message";

type FeatureCardProps = {
  icon: React.ReactElement;
  text: string;
};

const FeatureCard = ({ icon, text }: FeatureCardProps) => (
  <View style={landingStyles.featureCard}>
    <View style={landingStyles.cardIcon}>{icon}</View>
    <Text style={landingStyles.cardText}>{text}</Text>
  </View>
);

const LandingSection = () => (
  <View style={landingStyles.container}>
    <View style={landingStyles.headerContainer}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={landingStyles.headerLogo}
      />
      <View>
        <Text style={landingStyles.headerText}>
          GOVERNMENT OF MADHYA PRADESH
        </Text>
        <Text style={landingStyles.subHeaderText}>
          Ministry of Labour & Employment
        </Text>
      </View>
    </View>

    <Text style={landingStyles.mainTitle}>SRAM</Text>
    <Text style={landingStyles.subTitle}>श्रमिक अधिकार और खाता प्रबंधन</Text>
    <Text style={landingStyles.subTitleEnglish}>
      Sramik Rights & Account Management
    </Text>
    <Text style={landingStyles.description}>
      Digital India initiative for transparent labor compliance, worker rights
      protection, and automated wage management system.
    </Text>

    <View style={landingStyles.cardGrid}>
      <FeatureCard
        icon={<FontAwesome5 name="briefcase" size={32} color="#fff" />}
        text={`नियुक्ता पोर्टल\nEmployer Portal`}
      />
      <FeatureCard
        icon={<FontAwesome5 name="users" size={32} color="#fff" />}
        text={`श्रमिक पोर्टल\nWorker Portal`}
      />
      <FeatureCard
        icon={<FontAwesome5 name="clock" size={32} color="#fff" />}
        text={`समय ट्रैकिंग\nTime Tracking`}
      />
      <FeatureCard
        icon={<FontAwesome5 name="shield-alt" size={32} color="#fff" />}
        text={`अनुपालन\nCompliance`}
      />
    </View>

    <View style={landingStyles.footerContainer}>
      <Text style={landingStyles.footerText}>Wage Protection</Text>
      <Text style={landingStyles.footerText}>•</Text>
      <Text style={landingStyles.footerText}>Madhya Pradesh</Text>
    </View>
  </View>
);

const LoginSection = () => {
  const [activeTab, setActiveTab] = useState("Employer");
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const smallLockIcon = <MaterialIcons name="lock" size={24} color="#7A869A" />;
  const employerIcon = (
    <FontAwesome5 name="briefcase" size={24} color="#7A869A" />
  );
  const workerIcon = <FontAwesome5 name="user-tie" size={24} color="#7A869A" />;

  const handelEmployerLogin = async () => {
    if (Username && password) {
      const response = await employerLogin(Username.trim().toLowerCase(), password);
      if (response && response.success) {

        if (response.role === "employer") {
          router.replace("/(employer)");
        } else {
          console.log("Something went wrong!");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed ❌",
          text2: response?.error || "Invalid credentials.",
        });
        return null;
      }
    } else {
      Toast.show({
        type: "info",
        text1: "Missing Input 📝",
        text2: "Enter username and password.",
      });
      return null;
    }
  };

  const handelWorkerLogin = async () => {
    if (Username && password) {
      const response = await workerLogin(Username.trim().toLowerCase(), password);
      if (response && response.success) {

        if (response.role === "worker") {
          router.replace("/(worker)");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed ❌",
          text2: response?.error || "Invalid credentials.",
        });
        return null;
      }
    } else {
      Toast.show({
        type: "info",
        text1: "Missing Input 📝",
        text2: "Enter username and password.",
      });
      return null;
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.headerContainer}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={loginStyles.logo}
        />
        <Text style={loginStyles.headerTitle}>Ministry of Labour</Text>
        <Text style={loginStyles.headerSubtitle}>Digital Platform</Text>
      </View>

      <View style={loginStyles.titleContainer}>
        <Text style={loginStyles.titleHindi}>साइन इन</Text>
        <Text style={loginStyles.titleEnglish}>Sign In</Text>
      </View>
      <Text style={loginStyles.description}>
        Choose your account type to access your dashboard
      </Text>

      <View style={loginStyles.toggleContainer}>
        <TouchableOpacity
          style={[
            loginStyles.toggleButton,
            activeTab === "Employer" && loginStyles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab("Employer")}
        >
          {employerIcon}
          <Text
            style={[
              loginStyles.toggleButtonText,
              activeTab === "Employer" && loginStyles.toggleButtonTextActive,
            ]}
          >
            Employer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            loginStyles.toggleButton,
            activeTab === "Worker" && loginStyles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab("Worker")}
        >
          {workerIcon}
          <Text
            style={[
              loginStyles.toggleButtonText,
              activeTab === "Worker" && loginStyles.toggleButtonTextActive,
            ]}
          >
            Worker
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Employer" ? (
        <>
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Username</Text>
            <TextInput
              style={[
                loginStyles.input,
                isUsernameFocused && loginStyles.inputFocused,
              ]}
              placeholder="your employer id"
              placeholderTextColor="#B0B8C4"
              keyboardType="default"
              autoCapitalize="none"
              value={Username}
              onChangeText={setUsername}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            />
          </View>

          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  loginStyles.input,
                  isPasswordFocused && loginStyles.inputFocused,
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#B0B8C4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: 14,
                }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="#7A869A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={loginStyles.loginButton}
            onPress={handelEmployerLogin}
          >
            <Text style={loginStyles.loginButtonText}>
              नियुक्ता के रूप में साइन इन करें
            </Text>
          </TouchableOpacity>
          <Text style={loginStyles.loginButtonSubtitle}>
            Sign in as Employer
          </Text>
        </>
      ) : (
        <>
          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Username</Text>
            <TextInput
              style={[
                loginStyles.input,
                isUsernameFocused && loginStyles.inputFocused,
              ]}
              placeholder="your worker id"
              placeholderTextColor="#B0B8C4"
              keyboardType="default"
              autoCapitalize="none"
              value={Username}
              onChangeText={setUsername}
              onFocus={() => setIsUsernameFocused(true)}
              onBlur={() => setIsUsernameFocused(false)}
            />
          </View>

          <View style={loginStyles.inputContainer}>
            <Text style={loginStyles.inputLabel}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  loginStyles.input,
                  isPasswordFocused && loginStyles.inputFocused,
                ]}
                placeholder="Enter your password"
                placeholderTextColor="#B0B8C4"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 15,
                  top: 14,
                }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={22}
                  color="#7A869A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={loginStyles.loginButton}
            onPress={handelWorkerLogin}
          >
            <Text style={loginStyles.loginButtonText}>
              श्रमिक के रूप में साइन इन करें
            </Text>
          </TouchableOpacity>
          <Text style={loginStyles.loginButtonSubtitle}>Sign in as Worker</Text>
        </>
      )}

      <View style={loginStyles.registerContainer}>
        <Text style={loginStyles.registerText}>Don't have an account?</Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text style={loginStyles.registerLink}>Register here</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={loginStyles.footerContainer}>
        <View style={loginStyles.secureContainer}>
          {smallLockIcon}
          <Text style={loginStyles.secureText}>
            सुरक्षित और संरक्षित • Secure & Protected
          </Text>
        </View>
      </View>
    </View>
  );
};

const CombinedLoginPage = () => {
  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <LinearGradient
            colors={["#FF9933", "#138808"]}
            style={StyleSheet.absoluteFill}
          />
          <StatusBar barStyle="light-content" />
          <LinearGradient colors={["#FF9933", "#138808"]} style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{
                paddingVertical: 40,
                paddingHorizontal: 20,
              }}
            >
              <LandingSection />
              <View style={{ height: 40 }} />
              <LoginSection />
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default CombinedLoginPage;
