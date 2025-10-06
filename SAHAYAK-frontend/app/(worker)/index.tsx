import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { logout } from "@/api/Auth/auth_routes";
import { fetchWorkerProfile } from "@/api/Worker/profile_routes";
import { useWorker } from "@/context/WorkerContext";

const index = () => {
  const router = useRouter();
  const {setWorker} = useWorker()

  const handleLogout = async () => {
    await logout();
    router.replace("/modal");
  };
  useEffect(() => {
    const fetchingWorker = async () => {
      let w = await fetchWorkerProfile();
      const data = {
      firstName: w.first_name,
      lastName: w.last_name,
      username: w ? w?.username : "",
      contactNumber: w.contact_number,
      gender: w.gender,
      skill: w.skill,
      address: w.address,
    };
      setWorker(data);
    }
    fetchingWorker()
  }, [])

  return (
    <View>
      <Text>This is Worker Home page</Text>
      <Text onPress={handleLogout} style={{ paddingTop: 50 }}>
        Logout
      </Text>
    </View>
  );
};

export default index;
