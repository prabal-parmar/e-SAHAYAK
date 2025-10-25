import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import { styles } from "../../components/styles/downloadAttendance";
import { fetchAttendanceDataByDate } from "@/api/Employer/attendance_routes";
import { useIsFocused } from "@react-navigation/native";
import { generateAttendancePDF } from "@/components/pdf/attendancePDF";
import Toast from "react-native-toast-message";

interface Worker {
  workerId: string;
  Shift: string;
  name: string;
  entryTime: string;
  leavingTime: string;
  overtimeEntry: string | null;
  overtimeLeaving: string | null;
}

const WorkerCard: React.FC<{ item: Worker }> = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.workerName}>{item.name}</Text>
      <Text style={styles.workerId}>{item.workerId}</Text>
      <Text style={styles.workerId}>({item.Shift})</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.timeSection}>
      <Text style={styles.sectionTitle}>🕒 Regular Hours</Text>
      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>In: {item.entryTime}</Text>
        <Text style={styles.timeLabel}>Out: {item.leavingTime}</Text>
      </View>
    </View>
    {item.overtimeEntry && (
      <View style={styles.timeSection}>
        <Text style={styles.sectionTitle}>✨ Overtime Hours</Text>
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>In: {item.overtimeEntry}</Text>
          <Text style={styles.timeLabel}>
            Out: {item.overtimeLeaving ?? ""}
          </Text>
        </View>
      </View>
    )}
  </View>
);

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchTodayData = async () => {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const data = await fetchAttendanceDataByDate({
        day: day,
        month: month,
        year: year,
      });
      const fetchedData = data;

      setWorkers(fetchedData);
    };
    if (isFocused) {
      fetchTodayData();
    }
  }, [isFocused]);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const minimumDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const formatYMD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const markedDates = {
    [formatYMD(selectedDate)]: {
      selected: true,
      selectedColor: "#4A90E2",
      selectedTextColor: "white",
    },
  };

  const onDayPress = (day: { dateString: string; timestamp: number }) => {
    const pressed = new Date(day.timestamp);
    if (pressed < minimumDate) {
      setSelectedDate(minimumDate);
    } else if (pressed > today) {
      setSelectedDate(today);
    } else {
      setSelectedDate(pressed);
    }
  };

  const handleDownloadPdf = async () => {
    await generateAttendancePDF(
      workers,
      `${selectedDate.getDate()}/${selectedDate.getMonth()}/${selectedDate.getFullYear()}`
    );
    Toast.show({
      type: "success",
      text1: "PDF Downloaded ✅",
      text2: "Attendance report saved.",
    });
  };

  const handleGoBack = () => {
    router.replace("/profile");
  };

  const handleDateSelected = async () => {
    if (!selectedDate) {
      Toast.show({
        type: "info",
        text1: "No Date Selected 📅",
        text2: "Please select a date first.",
      });
      return null;
    }
    setShowCalendar(false);
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();

    try {
      const data = await fetchAttendanceDataByDate({
        day: day,
        month: month,
        year: year,
      });
      const fetchedData = data;
      setWorkers(fetchedData);
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#4A90E2" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <MaterialIcons name="date-range" size={28} color="#4A90E2" />
          <Text style={styles.headerTitle}>Worker Attendance</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.dateSelector}>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={{
            ...styles.dateDisplay,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Feather name="chevron-down" size={18} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
        </TouchableWithoutFeedback>

        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: "20%",
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
              color: "#222",
            }}
          >
            Select date
          </Text>

          <Calendar
            current={formatYMD(selectedDate)}
            minDate={formatYMD(minimumDate)}
            maxDate={formatYMD(today)}
            onDayPress={(day) => onDayPress(day)}
            markedDates={markedDates}
            style={{ borderRadius: 8 }}
            theme={{
              arrowColor: "#4A90E2",
              todayTextColor: "#4A90E2",
              selectedDayBackgroundColor: "#4A90E2",
              monthTextColor: "#333",
              textDayFontFamily:
                Platform.OS === "android" ? "Roboto" : undefined,
              textDayHeaderFontWeight: "600",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#4A90E2", fontWeight: "600" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDateSelected()}
              style={{
                backgroundColor: "#4A90E2",
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={workers}
        renderItem={({ item }) => <WorkerCard item={item} />}
        keyExtractor={(item) => item.workerId}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>
              No records found for this date.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={handleDownloadPdf}
      >
        <Feather name="download" size={20} color="white" />
        <Text style={styles.downloadButtonText}>Download as PDF</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
