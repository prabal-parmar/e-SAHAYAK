import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {styles} from '../../components/styles/workerReport'
import { useFocusEffect } from "@react-navigation/native";
import { getAllReports } from "@/api/Worker/report_routes";
import LoadingIndicator from "@/components/loadingPage";

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

type ReportStatus = "pending" | "resolved";
type ReportReason = "Salary" | "Attendance" | "Behaviour" | "Other";

type ReportEntry = {
  id: string;
  organizationName: string;
  date: Date;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
};

const ReportStatusBadge = ({ status }: { status: ReportStatus }) => {
  const config = {
    pending: { icon: "hourglass-empty", color: "#F39C12", text: "Pending" },
    resolved: { icon: "check-circle", color: "#27AE60", text: "Resolved" },
  }[status];

  return (
    <View
      style={[styles.statusBadge, { backgroundColor: `${config.color}20` }]}
    >
      <MaterialIcons
        name={config.icon as any}
        size={moderateScale(14)}
        color={config.color}
      />
      <Text style={[styles.statusText, { color: config.color }]}>
        {config.text}
      </Text>
    </View>
  );
};

export default function WorkerReportsPage() {
  const [activeFilter, setActiveFilter] = useState<ReportStatus>("pending");
  const [allReports, setAllReports] = useState<ReportEntry[]>([])
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAllReports();
      setAllReports(res.data || res);
    } catch (e) {
      console.error("Failed to fetch reports:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const filteredReports = useMemo(
    () =>
      allReports
        .filter((report) => report.status === activeFilter),
    [allReports, activeFilter]
  );

  const renderReportItem = ({ item: report }: { item: ReportEntry }) => (
    <View key={report.id} style={styles.reportRow}>
      <View style={styles.reportIconContainer}>
        <MaterialIcons name={"flag"} size={moderateScale(24)} color={"#C0392B"} />
      </View>
      <View style={styles.reportDetails}>
        <Text style={styles.reportOrg}>{report.organizationName}</Text>
        <Text style={styles.reportReason}>Reason: {report.reason}</Text>
        <Text style={styles.reportDescription}>"{report.description}"</Text>
        <Text style={styles.reportDate}>
          Reported on{" "}
          {new Date(report.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
          })}
        </Text>
      </View>
      <ReportStatusBadge status={report.status} />
    </View>
  );

  if (loading && allReports.length === 0)
    return <LoadingIndicator />

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#B31217", "#240B36"]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSubtitle}>
            Track the status of your reported issues
          </Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <View style={styles.listHeader}>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  onPress={() => setActiveFilter("pending")}
                  style={[
                    styles.filterButton,
                    activeFilter === "pending" && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === "pending" && styles.filterTextActive,
                    ]}
                  >
                    Pending
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveFilter("resolved")}
                  style={[
                    styles.filterButton,
                    activeFilter === "resolved" && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === "resolved" && styles.filterTextActive,
                    ]}
                  >
                    Resolved
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={filteredReports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderReportItem}
              refreshing={loading}
              onRefresh={fetchReports}
              ListEmptyComponent={
                <Text style={styles.noItemsText}>
                  You have no {activeFilter} reports.
                </Text>
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

