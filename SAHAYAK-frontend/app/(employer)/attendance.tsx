import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { styles } from "@/components/styles/attendanceStyles";
import {
  getAllWorkers,
  getAllWorkersWorking,
  markClockInTime,
  markClockOutTime,
} from "@/api/Employer/attendance_routes";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

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
}

const SHIFTS_DATA: Shift[] = [
  { id: "1", label: "Shift 1", name: "shift1" },
  { id: "2", label: "Shift 2", name: "shift2" },
  { id: "3", label: "Overtime", name: "overtime" },
];

interface DropdownModalProps<T> {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  data: T[];
  title: string;
  renderItem: (item: T) => string;
}

function DropdownModal<T>({
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
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
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
  const [markClockout, setMarkClockout] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workingWorkers, setWorkingWorkers] = useState<Working[] | null>([]);
  const [expandedShifts, setExpandedShifts] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const toggleShift = (shiftName: string) => {
    setExpandedShifts((prevState) => ({
      ...prevState,
      [shiftName]: !prevState[shiftName],
    }));
  };

  const workersByShift = workingWorkers?.reduce((acc, worker) => {
    const shiftKey = worker.shift || "Unassigned";
    if (!acc[shiftKey]) {
      acc[shiftKey] = [];
    }
    acc[shiftKey].push(worker);
    return acc;
  }, {} as { [key: string]: typeof workingWorkers });

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
      // console.log(workingWorkers)
      const updatedWorkers = allWorkers.filter(
        (w: any) =>
          !workingWorkers.some((ww: any) => ww.username === w.username)
      );
      const currentWorkingWorkers = workingWorkers.filter(
        (w: any) => !w.leaving_time
      );
      setTotalWorkerWorking(currentWorkingWorkers.length);
      setWorkers(updatedWorkers);
      setWorkingWorkers(workingWorkers);
    } catch (error) {
      console.log("failed to fetch workers", error);
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
    const data = {
      workerUsername: selectedWorker?.username,
      clockInTime: `${clockInTime.getHours()}:${clockInTime.getMinutes()}`,
      shift: selectedShift?.name,
      description: description,
      date: clockInTime.toISOString().split("T")[0],
    };
    if (selectedWorker && clockInTime && selectedShift) {
      // console.log(clockInTime.getHours())
      await markClockInTime(data);
      await fetchAllWorkers();
      setSelectedShift(null);
      setClockInTime(new Date());
      setSelectedWorker(null);
      setDescription("");
    } else {
      console.log("Select the mandatory fields first.");
    }
  };

  const handelClockOut = async (worker: Working) => {
    try {
      const matchedShift = SHIFTS_DATA.find((s) => s.name === worker.shift);
      setMarkClockout(true);
      setSelectedWorker(worker);
      if (matchedShift) {
        setSelectedShift(matchedShift);
      } else {
        setSelectedShift(null);
      }
      const entryDateTime = new Date(`${worker.date}T${worker.entry_time}`);
      setClockInTime(entryDateTime);
    } catch (error) {
      console.log(error);
    }
  };

  const handlemarkClockOutTime = async () => {
    try {
      const data = {
        workerUsername: selectedWorker?.username,
        clockOutTime: `${clockOutTime.getHours()}:${clockOutTime.getMinutes()}`,
        description: description,
        date: clockOutTime.toISOString().split("T")[0],
      };
      // console.log(
      //   `${clockOutTime.getFullYear()}-${clockOutTime.getMonth()}-${clockOutTime.getDate()}`
      // );
      if (selectedWorker && clockOutTime) {
        // console.log(clockInTime.getHours())
        await markClockOutTime(data);
        await fetchAllWorkers();
        setClockInTime(new Date());
        setSelectedShift(null);
        setClockOutTime(new Date());
        setSelectedWorker(null);
        setDescription("");
        setMarkClockout(false);
      } else {
        console.log("Select the mandatory fields first.");
      }
    } catch (error) {
      console.log(error);
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

  const formatTaskDate = (date: Date) => {
    return date.toLocaleDateString("en-GB");
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
      <DropdownModal
        isVisible={isWorkerModalVisible}
        onClose={() => setWorkerModalVisible(false)}
        onSelect={setSelectedWorker}
        data={workers}
        title="Select Worker"
        renderItem={(item) => `${item.username}`}
      />
      <DropdownModal
        isVisible={isShiftModalVisible}
        onClose={() => setShiftModalVisible(false)}
        onSelect={setSelectedShift}
        data={SHIFTS_DATA}
        title="Select Shift"
        renderItem={(item) => item.label}
      />
      {showPicker && (
        <Modal
          transparent
          visible={true}
          animationType="fade"
        >
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
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Shift</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShiftModalVisible(true)}
              >
                <Text>{selectedShift?.label || "Select a shift"}</Text>
              </TouchableOpacity>
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
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Overtime Clock-Out</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => showDateTimePicker("overtimeClockOut")}
                >
                  <Text>{formatDate(overtimeClockOutTime)}</Text>
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
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Clock Out Time</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => showDateTimePicker("clockOut")}
                >
                  <Text>{formatDate(clockOutTime)}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Deadline (Optional)</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => showDateTimePicker("deadline")}
              >
                <Text>{formatTaskDate(deadline)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Work Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.dropdown, styles.textArea]}
            placeholder="Describe the work assigned..."
            multiline
          />

          {markClockout ? (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={handlemarkClockOutTime}
            >
              <Text style={styles.buttonText}>Mark Attendance</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, { backgroundColor: "#2c3e50" }]} 
            onPress={handleClockIn}>
              <Text style={styles.buttonText}>Add ClockIn</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Attendance</Text>

          {!workingWorkers || workingWorkers.length === 0 ? (
            <View style={styles.noAttendanceContainer}>
              <Text style={styles.noAttendanceText}>
                No attendance marked today
              </Text>
            </View>
          ) : (
            Object.keys(workersByShift || {}).map((shiftName) => (
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
                        {workersByShift?.[shiftName]?.length || 0}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.expandIcon}>
                    {expandedShifts[shiftName] ? "−" : "+"}
                  </Text>
                </TouchableOpacity>

                {expandedShifts[shiftName] && (
                  <View style={styles.shiftContent}>
                    {workersByShift &&
                      workersByShift[shiftName].map((worker, index) => (
                        <TouchableOpacity
                          onPress={() => handelClockOut(worker)}
                          key={index}
                        >
                          <View style={styles.attendanceRow}>
                            <View style={styles.workerInfo}>
                              {!worker?.leaving_time ? (
                                <View style={styles.statusIndicatorGreen} />
                              ) : (
                                <View style={styles.statusIndicatorRed} />
                              )}
                              <View>
                                <Text style={styles.workerName}>
                                  {worker?.username || "Unknown"}
                                </Text>
                                <Text style={styles.workerDetail}>
                                  Shift: {getShiftLabel(worker?.shift)}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.timeInfo}>
                              <Text style={styles.timeLabel}>Clock In</Text>
                              <Text style={styles.timeValue}>
                                {worker?.entry_time}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
