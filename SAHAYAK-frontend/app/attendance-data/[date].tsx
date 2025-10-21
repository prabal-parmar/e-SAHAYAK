import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { getAttendanceDetailsByDate } from "@/api/Worker/home_routes";
import { styles } from '@/components/styles/attendanceDetails';

export default function AttendanceDetails() {
  const { date } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getAttendanceDetailsByDate(date as string);
        setDetails(res ? res.data : null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [date]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0072FF" />
        <Text style={styles.loadingText}>Loading attendance...</Text>
      </SafeAreaView>
    );
  }

  if (!details) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.noDataText}>No attendance found for {`${date.toString().split("-")[2]}-${date.toString().split("-")[1]}-${date.toString().split("-")[0]}`}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#0072FF", "#00C6FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance Details</Text>
        </View>
        <Text style={styles.headerDate}>{`${date.toString().split("-")[2]}-${date.toString().split("-")[1]}-${date.toString().split("-")[0]}`}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Work Summary</Text>

          <DetailRow label="Organization" value={details.organizationName} />
          <DetailRow label="Shift" value={details.Shift} />
          <DetailRow label="Entry Time" value={details.entryTime} />
          <DetailRow label="Leaving Time" value={details.leavingTime} />
          <DetailRow label="Earning" value={`₹${details.earning}`} />

          {details.overtimeEntryTime && (
            <>
              <View style={styles.divider} />
              <Text style={styles.overtimeTitle}>Overtime Details</Text>
              <DetailRow label="Overtime Entry" value={details.overtimeEntryTime} />
              <DetailRow label="Overtime Leaving" value={details.overtimeLeavingTime} />
              <DetailRow label="Overtime Earning" value={`₹${details.overtimeEarning}`} />
            </>
          )}

          <View style={styles.divider} />
          <Text style={styles.totalText}>Total: ₹{details.totalAmount}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);
