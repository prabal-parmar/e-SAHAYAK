import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../components/styles/employerHome";
import { getAllWorkersWorking } from "@/api/Employer/attendance_routes";
import { getEmployerProfile } from "@/api/Employer/profile_routes";
import { useEmployer } from "@/context/EmployerContext";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import type { ColorValue } from "react-native";
import {
  getWorkersWage,
  updateWorkerSalaryGiven,
} from "@/api/Employer/index_routes";
import Toast from "react-native-toast-message";

type Shift = { id: string; label: string; name: string };
const SHIFTS_DATA: Shift[] = [
  { id: "1", label: "Shift 1", name: "shift1" },
  { id: "2", label: "Shift 2", name: "shift2" },
  { id: "3", label: "Overtime", name: "overtime" },
];

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: any) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size: any, factor = 0.5) =>
  size + (scale(size) - size) * factor;

interface Worker {
  username: string;
  entry_time: string;
  skill: string;
  leaving_time: string;
  shift: string;
  date: string;
  overtime_entry_time: string;
  overtime_leaving_time: string;
}

interface WorkerSalary {
  id: number;
  workerUsername: string;
  entryTime: string;
  leavingTime: string;
  overtimeEntryTime: string;
  overtimeLeavingTime: string;
  amount: string;
  Date?: string;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  colors: [ColorValue, ColorValue, ...ColorValue[]];
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, colors }) => (
  <LinearGradient colors={colors} style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </LinearGradient>
);

export default function EmployerHomePage() {
  const { employer, setEmployer } = useEmployer();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedShifts, setExpandedShifts] = useState<{
    [key: string]: boolean;
  }>({});
  const [workers, setWorkers] = useState<Worker[] | null>(null);
  const [shift1Count, setShift1Count] = useState<Number>(0);
  const [shift2Count, setShift2Count] = useState<Number>(0);
  const [overtimeCount, setOverTimeCount] = useState<Number>(0);
  const [workerPendingSalary, setWorkerPendingSalary] = useState<
    WorkerSalary[]
  >([]);
  const [loadingWages, setLoadingWages] = useState<boolean>(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getWorkersPendingWages = async () => {
      try {
        setLoadingWages(true);
        const data = await getWorkersWage();

        const sortedData = data.data.sort((a: any, b: any) => {
          const today = new Date().toISOString().split("T")[0];
          const aDate = a.date?.split("T")[0] || "";
          const bDate = b.date?.split("T")[0] || "";
          if (aDate === today && bDate !== today) return -1;
          if (bDate === today && aDate !== today) return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setWorkerPendingSalary(sortedData);
      } catch (error: any) {
        console.log(error);
        Toast.show({
          type: "error",
          text1: "Wage Fetch Failed 😔",
          text2: error.message || "Could not load pending wages.",
        });
      } finally {
        setLoadingWages(false);
      }
    };
    if (isFocused) getWorkersPendingWages();
  }, [isFocused]);

  const markSalaryPaid = async (id: number) => {
    try {
      await updateWorkerSalaryGiven(id);
      setWorkerPendingSalary((prev) => prev.filter((w) => w.id !== id));
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Payment Failed 😔",
        text2: "Could not mark salary as paid.",
      });
    }
  };

  const fetchWorkingWorkers = async () => {
    try {
      const allWorkers = await getAllWorkersWorking();
      const currentWorkingWorkers = allWorkers.filter(
        (w: any) => !w.leaving_time
      );
      const currentOvertimeWorkers = allWorkers.filter(
        (w: any) => w.overtime_entry_time && !w.overtime_leaving_time
      ).length;

      const shift1workers =
        currentWorkingWorkers?.filter((w: Worker) => w.shift === "shift1")
          .length || 0;
      const shift2workers =
        currentWorkingWorkers?.filter((w: Worker) => w.shift === "shift2")
          .length || 0;

      setShift1Count(shift1workers);
      setShift2Count(shift2workers);
      setOverTimeCount(currentOvertimeWorkers);
      setWorkers(currentWorkingWorkers);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: "Could not fetch working workers data.",
      });
    }
  };

  const fetchEmployerData = async () => {
    try {
      const response = await getEmployerProfile();
      setEmployer(response);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: error.message || "Could not fetch employer profile.",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        setWorkers(null);
        await fetchWorkingWorkers();
        await fetchEmployerData();
      }
      fetchData();
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, [])
  );

  const filteredWorkers = useMemo(
    () =>
      workers?.filter((worker) =>
        worker.username.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [],
    [workers, searchQuery]
  );

  const workersByShift = useMemo(
    () =>
      filteredWorkers?.reduce((acc, worker) => {
        const shiftKey = worker.shift || "Unassigned";
        if (!acc[shiftKey]) acc[shiftKey] = [];
        acc[shiftKey].push(worker);
        return acc;
      }, {} as { [key: string]: Worker[] }),
    [filteredWorkers]
  );

  const toggleShift = (shiftName: string) => {
    setExpandedShifts((prevState) => ({
      ...prevState,
      [shiftName]: !prevState[shiftName],
    }));
  };

  const getShiftLabel = (shiftName: string): string => {
    const shift = SHIFTS_DATA.find((s) => s.name === shiftName);
    return shift ? shift.label : "Unknown Shift";
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={["#FF8C00", "#FF6347"]} style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerGreeting}>Welcome back,</Text>
              <Text style={styles.headerName}>{employer?.org_name || "?"}</Text>
            </View>
            <View style={styles.headerAvatarContainer}>
              <Text style={styles.headerAvatarText}>
                {getInitials(employer?.username || "?")}
              </Text>
            </View>
          </View>
          <View style={styles.headerBottomRow}>
            <Text style={styles.headerDate}>{currentTime.toDateString()}</Text>
            <Text style={styles.headerTime}>
              {currentTime.toLocaleTimeString("en-IN")}
            </Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          >
            <StatCard
              icon={
                <MaterialIcons
                  name="groups"
                  size={moderateScale(24)}
                  color="#fff"
                />
              }
              value={`${shift1Count}`}
              label="Shift 1"
              colors={["#3498DB", "#2980B9"]}
            />
            <StatCard
              icon={
                <MaterialIcons
                  name="groups"
                  size={moderateScale(24)}
                  color="#fff"
                />
              }
              value={`${shift2Count}`}
              label="Shift 2"
              colors={["#9B59B6", "#8E44AD"]}
            />
            <StatCard
              icon={
                <MaterialIcons
                  name="add-alarm"
                  size={moderateScale(24)}
                  color="#fff"
                />
              }
              value={`${overtimeCount}`}
              label="Overtime"
              colors={["#E67E22", "#D35400"]}
            />
            <StatCard
              icon={
                <MaterialIcons
                  name="engineering"
                  size={moderateScale(24)}
                  color="#fff"
                />
              }
              value={`${workers?.length}`}
              label="Total Workers"
              colors={["#1ABC9C", "#16A085"]}
            />
          </ScrollView>

          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Currently Working</Text>
            <View style={styles.searchContainer}>
              <MaterialIcons
                name="search"
                size={moderateScale(22)}
                color="#7A869A"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search worker..."
                placeholderTextColor="#7A869A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {workersByShift && Object.keys(workersByShift).length > 0 ? (
            Object.keys(workersByShift).map((shiftName) => (
              <View key={shiftName} style={styles.shiftSection}>
                <TouchableOpacity
                  style={styles.shiftHeader}
                  onPress={() => toggleShift(shiftName)}
                >
                  <View style={styles.shiftHeaderTitle}>
                    <Text style={styles.shiftName}>
                      {getShiftLabel(shiftName)}
                    </Text>
                    <View style={styles.workerCountBadge}>
                      <Text style={styles.workerCountText}>
                        {workersByShift[shiftName].length}
                      </Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={
                      expandedShifts[shiftName] ? "expand-less" : "expand-more"
                    }
                    size={moderateScale(28)}
                    color="#7A869A"
                  />
                </TouchableOpacity>

                {expandedShifts[shiftName] && (
                  <View style={styles.shiftContent}>
                    {workersByShift[shiftName].map((worker, i) => (
                      <View
                        key={`${shiftName}-${worker.username}-${i}`}
                        style={styles.attendanceRow}
                      >
                        <View
                          style={
                            worker?.leaving_time
                              ? styles.statusIndicatorRed
                              : styles.statusIndicatorGreen
                          }
                        />
                        <View style={styles.workerInfo}>
                          <Text style={styles.workerName}>
                            {worker.username}
                          </Text>
                          {worker?.skill && (
                            <Text style={styles.workerDetail}>
                              {worker.skill}
                            </Text>
                          )}
                        </View>
                        <View style={styles.timeInfo}>
                          <Text style={styles.timeLabel}>Working Since</Text>
                          <Text style={styles.timeValue}>
                            {worker.entry_time}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No working workers found.
              </Text>
            </View>
          )}

          <View style={[styles.listHeader, { marginTop: moderateScale(25) }]}>
            <Text style={styles.sectionTitle}>Pending Wages</Text>
          </View>

          {loadingWages ? (
            <ActivityIndicator
              size="large"
              color="#FF6347"
              style={{ marginTop: 20 }}
            />
          ) : workerPendingSalary.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No pending wages found.</Text>
            </View>
          ) : (
            workerPendingSalary.map((wage) => (
              <View
                key={`${wage.id}-${wage.workerUsername}-${wage.Date || ""}`}
                style={styles.shiftSection}
              >
                <View
                  style={[
                    styles.attendanceRow,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workerName}>{wage.workerUsername}</Text>
                    {wage.Date && (
                      <Text style={styles.workerDetail}>
                        Date: {wage.Date?.split("T")[0] || "--"}
                      </Text>
                    )}
                    <Text style={styles.workerDetail}>
                      Entry: {wage.entryTime || "--"}
                    </Text>
                    <Text style={styles.workerDetail}>
                      Leaving: {wage.leavingTime || "--"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => markSalaryPaid(wage.id)}
                    style={{
                      backgroundColor: "#FF6347",
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      borderRadius: 10,
                      alignSelf: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Pay ₹{wage.amount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
