import React, {
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../components/styles/employerHome";
import { getAllWorkersWorking } from "@/api/Employer/attendance_routes";
import { getEmployerProfile } from "@/api/Employer/profile_routes";
import { useEmployer } from "@/context/EmployerContext";
import { useFocusEffect } from "@react-navigation/native";
import type { ColorValue } from "react-native";

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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

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

  const fetchWorkingWorkers = async () => {
    try {
      
      const allWorkers = await getAllWorkersWorking();
      const currentWorkingWorkers = allWorkers.filter(
        (w: any) => !w.leaving_time
      );
      const currentOvertimeWorkers = allWorkers.filter(
        (w: any) => (w.overtime_entry_time && !w.overtime_leaving_time)
      ).length
      // console.log(currentWorkingWorkers)
      let shift1workers =
        currentWorkingWorkers?.filter((w: Worker) => w.shift === "shift1")
          .length || 0;
      let shift2workers =
        currentWorkingWorkers?.filter((w: Worker) => w.shift === "shift2")
          .length || 0;

      setShift1Count(shift1workers);
      setShift2Count(shift2workers);
      setOverTimeCount(currentOvertimeWorkers)
      setWorkers(currentWorkingWorkers);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployerData = async () => {
    const response = await getEmployerProfile();
    setEmployer(response);
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
      filteredWorkers &&
      filteredWorkers.reduce((acc, worker) => {
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

          {workersByShift && Object.keys(workersByShift)?.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No working workers found.</Text>
            </View>
          ) : (
            <>
              {workersByShift &&
                Object.keys(workersByShift).map((shiftName) => (
                  <View key={shiftName} style={styles.shiftSection}>
                    <TouchableOpacity
                      style={styles.shiftHeader}
                      onPress={() => toggleShift(shiftName)}
                    >
                      <View style={styles.shiftHeaderTitle}>
                        <Text style={styles.shiftName}>{getShiftLabel(shiftName)}</Text>
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
                          <View key={i} style={styles.attendanceRow}>
                            {!worker?.leaving_time ? (
                              <View style={styles.statusIndicatorGreen} />
                            ) : (
                              <View style={styles.statusIndicatorRed} />
                            )}
                            <View style={styles.workerInfo}>
                              <Text style={styles.workerName}>{worker.username}</Text>
                              {worker?.skill && (
                                <Text style={styles.workerDetail}>{worker.skill}</Text>
                              )}
                            </View>
                            <View style={styles.timeInfo}>
                              <Text style={styles.timeLabel}>Working Since</Text>
                              <Text style={styles.timeValue}>{worker.entry_time}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}

              {overtimeCount !== 0 && filteredWorkers && filteredWorkers.length > 0 && (
                <View style={styles.shiftSection}>
                  <TouchableOpacity
                    style={styles.shiftHeader}
                    onPress={() => toggleShift("overtime")}
                  >
                    <View style={styles.shiftHeaderTitle}>
                      <Text style={styles.shiftName}>Overtime</Text>
                      <View style={styles.workerCountBadge}>
                        <Text style={styles.workerCountText}>
                          {
                            filteredWorkers.filter(
                              (w) => w.overtime_entry_time && !w.overtime_leaving_time
                            ).length
                          }
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name={
                        expandedShifts["overtime"] ? "expand-less" : "expand-more"
                      }
                      size={moderateScale(28)}
                      color="#7A869A"
                    />
                  </TouchableOpacity>

                  {expandedShifts["overtime"] && (
                    <View style={styles.shiftContent}>
                      {filteredWorkers
                        .filter((w) => w.overtime_entry_time)
                        .map((worker, i) => (
                          <View key={i} style={styles.attendanceRow}>
                            {worker.overtime_leaving_time ? (
                              <View style={styles.statusIndicatorRed} />
                            ) : (
                              <View style={styles.statusIndicatorGreen} />
                            )}

                            <View style={styles.workerInfo}>
                              <Text style={styles.workerName}>
                                {worker.username}
                                {!worker.overtime_leaving_time && (
                                  <Text
                                    style={{
                                      color: "#1ABC9C",
                                      fontSize: 12,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {"  "}• Working Overtime
                                  </Text>
                                )}
                              </Text>
                              {worker?.skill && (
                                <Text style={styles.workerDetail}>{worker.skill}</Text>
                              )}
                            </View>

                            <View style={styles.timeInfo}>
                              <Text style={styles.timeLabel}>
                                {worker.overtime_leaving_time
                                  ? "Completed At"
                                  : "Started At"}
                              </Text>
                              <Text style={styles.timeValue}>
                                {worker.overtime_leaving_time ||
                                  worker.overtime_entry_time ||
                                  "--:--"}
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
