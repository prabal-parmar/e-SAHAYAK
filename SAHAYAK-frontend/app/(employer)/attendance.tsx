import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "@/components/styles/attendanceStyles";
import {
  addFullAttendanceData,
  getAllWorkers,
  getAllWorkersWorking,
  markClockInTime,
  markClockOutTime,
  markOvertimeClockInTime,
  markOvertimeClockOutTime,
} from "@/api/Employer/attendance_routes";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

type Shift = { id: string; label: string; name: string };
type PickerMode =
  | "clockIn"
  | "clockOut"
  | "deadline"
  | "overtimeClockIn"
  | "overtimeClockOut";

interface Worker {
  username: string;
}

interface Working {
  username: string;
  entry_time: string;
  leaving_time: string;
  shift: string;
  date: string;
  done: Boolean;
  description: string;
  overtime: Boolean;
  overtime_entry_time: string;
  overtime_leaving_time: string;
}

const SHIFTS_DATA: Shift[] = [
  { id: "1", label: "Shift 1", name: "shift1" },
  { id: "2", label: "Shift 2", name: "shift2" },
  { id: "3", label: "Overtime", name: "overtime" },
];

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;

interface DropdownModalProps<T> {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  data: T[];
  title: string;
  renderItem: (item: T) => string;
}

function WorkerDropdownModal<T extends { username?: string }>({
  isVisible,
  onClose,
  onSelect,
  data,
  title,
  renderItem,
}: DropdownModalProps<T>) {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;
    return data.filter((item: any) =>
      item.username?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, data]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.searchBarContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#7A869A"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search worker..."
              placeholderTextColor="#7A869A"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <MaterialIcons name="close" size={20} color="#7A869A" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{renderItem(item)}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text style={{ color: "#7A869A", fontSize: 14 }}>
                  No workers found.
                </Text>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function ShiftDropdownModal<T>({
  isVisible,
  onClose,
  onSelect,
  data,
  title,
  renderItem,
}: DropdownModalProps<T>) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.modalItemText}>{renderItem(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function AttendancePage() {
  const [selectedWorker, setSelectedWorker] = useState<Working | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [clockInTime, setClockInTime] = useState<Date>(new Date());
  const [clockOutTime, setClockOutTime] = useState<Date>(new Date());
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [overtimeClockInTime, setOvertimeClockInTime] = useState<Date>(
    new Date()
  );
  const [overtimeClockOutTime, setOvertimeClockOutTime] = useState<Date>(
    new Date()
  );

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>("clockIn");
  const [totalWorkerWorking, setTotalWorkerWorking] = useState(0);
  const [isWorkerModalVisible, setWorkerModalVisible] = useState(false);
  const [isShiftModalVisible, setShiftModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workingWorkers, setWorkingWorkers] = useState<Working[] | null>([]);
  const [expandedShifts, setExpandedShifts] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [originalShift, setOriginalShift] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleShift = (shiftName: string) => {
    setExpandedShifts((prevState) => ({
      ...prevState,
      [shiftName]: !prevState[shiftName],
    }));
  };

  useEffect(() => {
    if (selectedShift?.name === "overtime" && selectedWorker) {
      if (selectedWorker.overtime_entry_time) {
        const [hours, minutes, seconds] =
          selectedWorker.overtime_entry_time.split(":");
        const entry = new Date();
        entry.setHours(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds || "0")
        );
        setOvertimeClockInTime(entry);
      }

      if (selectedWorker.overtime_leaving_time) {
        const [hours, minutes, seconds] =
          selectedWorker.overtime_leaving_time.split(":");
        const leave = new Date();
        leave.setHours(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds || "0")
        );
        setOvertimeClockOutTime(leave);
      }
    }
  }, [selectedShift, selectedWorker]);

  const workersByShift = workingWorkers?.reduce((acc, worker) => {
    const shiftKey = worker.shift || "Unassigned";
    if (!acc[shiftKey]) {
      acc[shiftKey] = [];
    }
    acc[shiftKey].push(worker);
    return acc;
  }, {} as { [key: string]: typeof workingWorkers });

  const filteredWorkers = useMemo(() => {
    if (!workingWorkers) return [];
    return workingWorkers
      .filter((w) => !w.done)
      .filter((w) =>
        w.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [workingWorkers, searchQuery]);

  const filteredWorkersByShift = useMemo(() => {
    return filteredWorkers.reduce((acc, worker) => {
      const shiftKey = worker.shift || "Unassigned";
      if (!acc[shiftKey]) acc[shiftKey] = [];
      acc[shiftKey].push(worker);
      return acc;
    }, {} as { [key: string]: Working[] });
  }, [filteredWorkers]);

  const filteredOvertimeWorkers = useMemo(() => {
    return filteredWorkers.filter((w) => w.overtime_entry_time && !w.done);
  }, [filteredWorkers]);

  const overtimeWorkers = workingWorkers?.filter(
    (w) => w.overtime_entry_time && w.overtime_entry_time !== null
  );

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      switch (pickerMode) {
        case "clockIn":
          setClockInTime(selectedDate);
          break;
        case "clockOut":
          setClockOutTime(selectedDate);
          break;
        case "deadline":
          setDeadline(selectedDate);
          break;
        case "overtimeClockIn":
          setOvertimeClockInTime(selectedDate);
          break;
        case "overtimeClockOut":
          setOvertimeClockOutTime(selectedDate);
          break;
      }
    }
  };

  const fetchAllWorkers = async () => {
    try {
      const allWorkers = await getAllWorkers();
      const workingWorkers = await getAllWorkersWorking();
      const updatedWorkers = allWorkers.filter(
        (w: any) =>
          !workingWorkers.some((ww: Working) => ww.username === w.username)
      );
      const currentWorkingWorkers = workingWorkers.filter(
        (w: any) => !w.leaving_time
      );
      setTotalWorkerWorking(currentWorkingWorkers.length);
      setWorkers(updatedWorkers);
      setWorkingWorkers(workingWorkers);
    } catch (error: any) {
      console.log("failed to fetch workers", error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: "Failed to load worker data.",
      });
    }
  };

  useEffect(() => {
    fetchAllWorkers();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAllWorkers();
  }, [currentTime.getDate()]);

  const handleClockIn = async () => {
    if (!clockInTime || !selectedWorker || !selectedShift) {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2: "Please select worker, shift, and clock-in time.",
      });
      return null;
    }
    const data = {
      workerUsername: selectedWorker?.username,
      clockInTime: `${clockInTime.getHours()}:${clockInTime.getMinutes()}`,
      shift: selectedShift?.name,
      description: description,
      date: clockInTime.toISOString().split("T")[0],
    };
    try {
      if (selectedWorker && clockInTime && selectedShift) {
        await markClockInTime(data);
        await fetchAllWorkers();
        setSelectedShift(null);
        setClockInTime(new Date());
        setSelectedWorker(null);
        setDescription("");
        setOriginalShift(null);
        Toast.show({
          type: "success",
          text1: "Clock-In Recorded ✅",
          text2: `Clock-in for ${selectedWorker.username} successful.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something Went Wrong!",
          text2: "Missing mandatory fields.",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: error.response?.data?.detail || "Could not record clock-in.",
      });
    }
  };

  const handleSelectedWorker = async (worker: Working) => {
    try {
      const matchedShift = SHIFTS_DATA.find((s) => s.name === worker.shift);
      setSelectedShift(matchedShift || null);
      setOriginalShift(worker.shift || null);
      setDescription(worker ? worker?.description : "");

      if (worker.entry_time) {
        const [hours, minutes, seconds] = worker.entry_time.split(":");
        const entry = new Date();
        entry.setHours(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds || "0")
        );
        setClockInTime(entry);
      }
      if (worker.leaving_time) {
        const [hours, minutes, seconds] = worker.leaving_time.split(":");
        const leaving = new Date();
        leaving.setHours(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds || "0")
        );
        setClockOutTime(leaving);
      }

      if (worker.shift === "overtime") {
        if (worker.overtime_entry_time) {
          const [hours, minutes, seconds] =
            worker.overtime_entry_time.split(":");
          const overtimeEntry = new Date();
          overtimeEntry.setHours(
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds || "0")
          );
          setOvertimeClockInTime(overtimeEntry);
        }

        if (worker.overtime_leaving_time) {
          const [hours, minutes, seconds] =
            worker.overtime_leaving_time.split(":");
          const overtimeOut = new Date();
          overtimeOut.setHours(
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds || "0")
          );
          setOvertimeClockOutTime(overtimeOut);
        }
      }
      setSelectedWorker(worker);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: error.message || "Could not load worker details.",
      });
    }
  };

  const saveFullAttendanceData = async () => {
    if (
      !selectedWorker?.username ||
      !selectedWorker?.entry_time ||
      !selectedWorker?.leaving_time ||
      !selectedWorker?.shift
    ) {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2: "Please ensure worker has clock-in/out times and a shift.",
      });
      return null;
    }
    try {
      const data = {
        worker: selectedWorker?.username,
        entry_time: selectedWorker?.entry_time,
        leaving_time: selectedWorker?.leaving_time,
        shift: selectedWorker?.shift,
        description: selectedWorker?.description,
        date: selectedWorker?.date,
        overtime: selectedWorker?.overtime,
        overtime_entry_time: selectedWorker?.overtime_entry_time,
        overtime_leaving_time: selectedWorker?.overtime_leaving_time,
      };
      const amount = await addFullAttendanceData(data);
      Toast.show({
        type: "success",
        text1: "Attendance Submitted ✅",
        text2: `Worker to collect ₹${amount.amount} from you!`,
      });
      await fetchAllWorkers();
      setSelectedShift(null);
      setSelectedWorker(null);
      setClockInTime(new Date());
      setClockOutTime(new Date());
      setDescription("");
      setOriginalShift(null);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: error.response?.data?.detail || "Could not submit attendance.",
      });
    }
  };

  const handlemarkClockOutTime = async () => {
    if (!clockInTime || !selectedWorker || !selectedShift) {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2: "Please select worker, shift, and clock-in time.",
      });
      return null;
    }
    if (clockOutTime <= clockInTime) {
      Toast.show({
        type: "error",
        text1: "Invalid Time ⏰",
        text2: "Clock-out time must be after clock-in time.",
      });
      return null;
    }
    const data = {
      workerUsername: selectedWorker?.username,
      clockOutTime: `${clockOutTime.getHours()}:${clockOutTime.getMinutes()}`,
      description: selectedWorker?.description,
    };
    try {
      if (selectedWorker && clockOutTime) {
        await markClockOutTime(data);
        fetchAllWorkers();
        Toast.show({
          type: "success",
          text1: "Clock-Out Recorded ✅",
          text2: `Clock-out for ${selectedWorker.username} successful.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something Went Wrong!",
          text2: "Missing mandatory fields.",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2: error.response?.data?.detail || "Could not record clock-out.",
      });
    }
  };

  const handleOvertimeClockIn = async () => {
    if (
      !selectedWorker?.username ||
      !selectedWorker?.entry_time ||
      !selectedWorker?.leaving_time ||
      !selectedWorker?.shift ||
      !overtimeClockInTime
    ) {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2:
          "Please ensure main shift is complete and select overtime clock-in time.",
      });
      return null;
    }
    if (clockOutTime >= overtimeClockInTime) {
      Toast.show({
        type: "error",
        text1: "Invalid Time ⏰",
        text2: "Overtime clock-in must be after regular clock-out time.",
      });
      return null;
    }
    const data = {
      workerUsername: selectedWorker?.username,
      clockInTime: `${overtimeClockInTime.getHours()}:${overtimeClockInTime.getMinutes()}`,
    };
    try {
      if (selectedWorker && overtimeClockInTime) {
        await markOvertimeClockInTime(data);
        await fetchAllWorkers();
        setSelectedShift(null);
        setClockInTime(new Date());
        setSelectedWorker(null);
        setDescription("");
        setOriginalShift(null);
        Toast.show({
          type: "success",
          text1: "Overtime Clock-In Recorded ✅",
          text2: `Overtime clock-in for ${selectedWorker.username} successful.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something Went Wrong!",
          text2: "Missing mandatory fields.",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2:
          error.response?.data?.detail || "Could not record overtime clock-in.",
      });
    }
  };

  const handleOvertimeClockOutTime = async () => {
    if (
      !selectedWorker?.entry_time ||
      !selectedWorker?.leaving_time ||
      !selectedWorker?.overtime_entry_time ||
      !selectedShift ||
      !selectedWorker?.username
    ) {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2: "Please ensure worker has overtime clock-in time.",
      });
      return null;
    }
    if (overtimeClockInTime >= overtimeClockOutTime) {
      Toast.show({
        type: "error",
        text1: "Invalid Time ⏰",
        text2: "Overtime clock-out must be after overtime clock-in.",
      });
      return null;
    }
    const data = {
      workerUsername: selectedWorker?.username,
      clockOutTime: `${overtimeClockOutTime.getHours()}:${overtimeClockOutTime.getMinutes()}`,
    };
    try {
      if (selectedWorker && overtimeClockOutTime) {
        await markOvertimeClockOutTime(data);
        await fetchAllWorkers();
        setSelectedShift(null);
        setClockInTime(new Date());
        setSelectedWorker(null);
        setDescription("");
        setOriginalShift(null);
        Toast.show({
          type: "success",
          text1: "Overtime Clock-Out Recorded ✅",
          text2: `Overtime clock-out for ${selectedWorker.username} successful.`,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Something Went Wrong!",
          text2: "Missing mandatory fields.",
        });
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
        text2:
          error.response?.data?.detail ||
          "Could not record overtime clock-out.",
      });
    }
  };

  const getShiftLabel = (shiftName: string): string => {
    const shift = SHIFTS_DATA.find((s) => s.name === shiftName);
    return shift ? shift.label : "Unknown Shift";
  };

  const showDateTimePicker = (mode: PickerMode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  const getDateTimeValue = () => {
    switch (pickerMode) {
      case "clockIn":
        return clockInTime;
      case "clockOut":
        return clockOutTime;
      case "deadline":
        return deadline;
      case "overtimeClockIn":
        return overtimeClockInTime;
      case "overtimeClockOut":
        return overtimeClockOutTime;
      default:
        return new Date();
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#0a2342", "#1e3c72"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopContent}>
            <Text style={styles.headerTitle}>Mark Worker Attendance</Text>
            <Text style={styles.headerSubtitle}>
              Log daily hours and manage your workforce efficiently.
            </Text>
          </View>
          <View style={styles.headerStatsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="today" size={20} color="#ecf0f1" />
              <Text style={styles.statValue}>
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <MaterialIcons name="groups" size={20} color="#ecf0f1" />
              <Text style={styles.statValue}>{totalWorkerWorking} Working</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={20} color="#ecf0f1" />
              <Text style={styles.statValue}>
                {currentTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </LinearGradient>
        <WorkerDropdownModal
          isVisible={isWorkerModalVisible}
          onClose={() => setWorkerModalVisible(false)}
          onSelect={(worker) => {
            setSelectedWorker({
              username: worker.username,
              entry_time: "",
              leaving_time: "",
              shift: "",
              date: "",
              done: false,
              description: "",
              overtime: false,
              overtime_entry_time: "",
              overtime_leaving_time: "",
            });
          }}
          data={workers}
          title="Select Worker"
          renderItem={(item) => `${item?.username}`}
        />
        <ShiftDropdownModal
          isVisible={isShiftModalVisible}
          onClose={() => setShiftModalVisible(false)}
          onSelect={setSelectedShift}
          data={SHIFTS_DATA}
          title="Select Shift"
          renderItem={(item) => item.label}
        />
        {showPicker && (
          <Modal transparent visible={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Pick Time</Text>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={getDateTimeValue()}
                    mode={pickerMode === "deadline" ? "date" : "time"}
                    display="spinner"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      onDateChange(event, date);
                    }}
                    textColor={Platform.OS === "ios" ? "#2c3e50" : undefined}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>☉ Mark Worker Attendance</Text>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Worker</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setWorkerModalVisible(true)}
                >
                  <Text>{selectedWorker?.username || "Select a worker"}</Text>
                </TouchableOpacity>
                {selectedWorker?.overtime_entry_time &&
                  !selectedWorker?.overtime_leaving_time && (
                    <Text
                      style={{
                        marginTop: 4,
                        marginLeft: 4,
                        fontSize: 12,
                        color: "#27ae60",
                        fontWeight: "bold",
                      }}
                    >
                      Working Overtime
                    </Text>
                  )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Shift</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShiftModalVisible(true)}
                >
                  <Text>{selectedShift?.label || "Select a shift"}</Text>
                </TouchableOpacity>

                {originalShift && (
                  <Text
                    style={{
                      marginTop: 4,
                      fontSize: 10,
                      color: "#7f8c8d",
                      fontStyle: "italic",
                    }}
                  >
                    Originally assigned:{" "}
                    <Text style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      {getShiftLabel(originalShift)}
                    </Text>
                  </Text>
                )}
              </View>
            </View>

            {selectedShift?.label.includes("Overtime") && (
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Overtime Clock-In</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => showDateTimePicker("overtimeClockIn")}
                  >
                    <Text>{formatDate(overtimeClockInTime)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clockInButton}
                    onPress={handleOvertimeClockIn}
                  >
                    <LinearGradient
                      colors={["#FBC02D", "#F57C00"]}
                      style={styles.clockInGradient}
                    >
                      <MaterialIcons name="login" size={22} color="#FFFFFF" />
                      <Text style={styles.clockInText}>Clock-In</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Overtime Clock-Out</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => showDateTimePicker("overtimeClockOut")}
                  >
                    <Text>{formatDate(overtimeClockOutTime)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clockInButton}
                    onPress={handleOvertimeClockOutTime}
                  >
                    <LinearGradient
                      colors={["#43A047", "#2E7D32"]}
                      style={styles.clockInGradient}
                    >
                      <MaterialIcons name="logout" size={22} color="#FFFFFF" />
                      <Text style={styles.clockInText}>Clock-Out</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {!selectedShift?.label.includes("Overtime") && (
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Clock In Time</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => showDateTimePicker("clockIn")}
                  >
                    <Text>{formatDate(clockInTime)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clockInButton}
                    onPress={handleClockIn}
                  >
                    <LinearGradient
                      colors={["#FBC02D", "#F57C00"]}
                      style={styles.clockInGradient}
                    >
                      <MaterialIcons name="login" size={22} color="#FFFFFF" />
                      <Text style={styles.clockInText}>Clock-In</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Clock Out Time</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => showDateTimePicker("clockOut")}
                  >
                    <Text>{formatDate(clockOutTime)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.clockInButton}
                    onPress={handlemarkClockOutTime}
                  >
                    <LinearGradient
                      colors={["#43A047", "#2E7D32"]}
                      style={styles.clockInGradient}
                    >
                      <MaterialIcons name="logout" size={22} color="#FFFFFF" />
                      <Text style={styles.clockInText}>Clock-Out</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={styles.label}>Work Description</Text>
            <TextInput
              value={selectedWorker?.description || ""}
              onChangeText={(text) =>
                setSelectedWorker((prev) =>
                  prev ? { ...prev, description: text } : prev
                )
              }
              style={[styles.dropdown, styles.textArea]}
              placeholder="Describe the work assigned..."
              multiline
            />

            {!selectedWorker?.done ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                onPress={() => saveFullAttendanceData()}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "green" }]}
                disabled={true}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Attendance</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F2F3F5",
                borderRadius: 10,
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <MaterialIcons name="search" size={20} color="#7A869A" />
              <TextInput
                style={{
                  flex: 1,
                  padding: 8,
                  fontSize: 14,
                  color: "#2C3E50",
                }}
                placeholder="Search worker by username..."
                placeholderTextColor="#7A869A"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            {!filteredWorkers || filteredWorkers.length === 0 ? (
              <View style={styles.noAttendanceContainer}>
                <Text style={styles.noAttendanceText}>
                  No matching workers found
                </Text>
              </View>
            ) : (
              Object.keys(filteredWorkersByShift || {}).map((shiftName) => (
                <View key={shiftName} style={styles.shiftSection}>
                  <TouchableOpacity
                    style={styles.shiftHeader}
                    onPress={() => toggleShift(shiftName)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.shiftHeaderTitle}>
                      <Text style={styles.shiftName}>
                        {getShiftLabel(shiftName)}
                      </Text>
                      <View style={styles.workerCountBadge}>
                        <Text style={styles.workerCountText}>
                          {filteredWorkersByShift?.[shiftName]?.length || 0}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.expandIcon}>
                      {expandedShifts[shiftName] ? "−" : "+"}
                    </Text>
                  </TouchableOpacity>

                  {expandedShifts[shiftName] && (
                    <View style={styles.shiftContent}>
                      {filteredWorkersByShift[shiftName].map(
                        (worker, index) => (
                          <TouchableOpacity
                            onPress={() => handleSelectedWorker(worker)}
                            key={index}
                          >
                            <View style={[styles.attendanceRow]}>
                              <View style={styles.workerInfo}>
                                {worker.leaving_time ? (
                                  <View style={styles.statusIndicatorRed} />
                                ) : (
                                  <View style={styles.statusIndicatorGreen} />
                                )}

                                <View>
                                  <Text style={[styles.workerName]}>
                                    {worker?.username || "Unknown"}
                                  </Text>

                                  <Text style={styles.workerDetail}>
                                    Shift: {getShiftLabel(worker?.shift)}
                                  </Text>

                                  <View
                                    style={[
                                      styles.statusTag,
                                      worker.done
                                        ? styles.statusTagSubmitted
                                        : styles.statusTagPending,
                                    ]}
                                  >
                                    <Text style={[styles.statusTagText]}>
                                      {worker.done ? "Submitted" : "Pending"}
                                    </Text>
                                  </View>
                                </View>
                              </View>

                              <View style={styles.timeInfo}>
                                {worker.leaving_time ? (
                                  <>
                                    <Text style={styles.timeLabel}>
                                      Clock Out
                                    </Text>
                                    <Text style={styles.timeValue}>
                                      {worker.leaving_time}
                                    </Text>
                                  </>
                                ) : (
                                  <>
                                    <Text style={styles.timeLabel}>
                                      Clock In
                                    </Text>
                                    <Text style={styles.timeValue}>
                                      {worker.entry_time}
                                    </Text>
                                  </>
                                )}
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  )}
                </View>
              ))
            )}
            {filteredOvertimeWorkers && filteredOvertimeWorkers.length > 0 && (
              <View style={styles.shiftSection}>
                <TouchableOpacity
                  style={styles.shiftHeader}
                  onPress={() => toggleShift("overtime")}
                  activeOpacity={0.7}
                >
                  <View style={styles.shiftHeaderTitle}>
                    <Text style={styles.shiftName}>Overtime</Text>
                    <View style={styles.workerCountBadge}>
                      <Text style={styles.workerCountText}>
                        {filteredOvertimeWorkers.length}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.expandIcon}>
                    {expandedShifts["overtime"] ? "−" : "+"}
                  </Text>
                </TouchableOpacity>

                {expandedShifts["overtime"] && (
                  <View style={styles.shiftContent}>
                    {filteredOvertimeWorkers.map((worker, index) => (
                      <TouchableOpacity
                        onPress={() => handleSelectedWorker(worker)}
                        key={index}
                      >
                        <View style={styles.attendanceRow}>
                          <View style={styles.workerInfo}>
                            {worker.overtime_leaving_time ? (
                              <View style={styles.statusIndicatorRed} />
                            ) : (
                              <View style={styles.statusIndicatorGreen} />
                            )}
                            <View>
                              <Text style={styles.workerName}>
                                {worker.username}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.timeInfo}>
                            {!worker.overtime_leaving_time ? (
                              <>
                                <Text style={styles.timeLabel}>Clock In</Text>
                                <Text style={styles.timeValue}>
                                  {worker?.overtime_entry_time}
                                </Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.timeLabel}>Clock Out</Text>
                                <Text style={styles.timeValue}>
                                  {worker?.overtime_leaving_time}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
