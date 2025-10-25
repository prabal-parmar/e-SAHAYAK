import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../components/styles/workerHome";
import {
  getCalenderDataByMonth,
  markSatisfiedTo5DaysData,
  recentWorkResonseStatus,
  updateResponse,
} from "@/api/Worker/home_routes";
import { generatePDF } from "@/components/pdf/workReceipt";
import { getPDFdata } from "@/api/Worker/get_pdf_data";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

type WorkStatus = "pending" | "satisfied" | "report";
type WorkEntry = {
  id: string;
  organizationName: string;
  date: Date;
  startTime: string;
  endTime: string;
  wages: number;
  status: WorkStatus;
};

type ReportReason = "Salary" | "Attendance" | "Behaviour" | "Other";

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const fetchMonthlyAttendance = async (month: number, year: number) => {
  const data = await getCalenderDataByMonth(month, year);
  // console.log(data)
  return data;
};

export default function WorkerHomePage() {
  const [workHistory, setWorkHistory] = useState<WorkEntry[]>([]);
  const [greeting, setGreeting] = useState("Welcome");
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );
  const [reportingWorkId, setReportingWorkId] = useState<string | null>(null);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [receiptData, setReceiptData] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadAttendanceData = async (month: number, year: number) => {
    try {
      setLoadingCalendar(true);

      const data = await fetchMonthlyAttendance(month, year);

      const statusMap: { [key: string]: string } = {};
      data.forEach((item: { date: string; status: string }) => {
        const date = item.date.split("T")[0];
        statusMap[date] = item.status;
      });

      const today = new Date();
      const daysInMonth = new Date(year, month, 0).getDate();
      const tempMarked: { [date: string]: any } = {};

      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        const dayOfWeek = new Date(date).getDay();
        const status = statusMap[date];
        const current = new Date(date);

        if (current > today) continue;

        if (status === "present") {
          tempMarked[date] = { marked: true, dots: [{ color: "#4CAF50" }] };
        } else if (status === "overtime") {
          tempMarked[date] = { marked: true, dots: [{ color: "#FFD600" }] };
        } else if (dayOfWeek !== 0) {
          tempMarked[date] = { marked: true, dots: [{ color: "#E53935" }] };
        }
      }

      setMarkedDates(tempMarked);
    } catch (error: any) {
      console.error("Error loading attendance data:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong!",
      });
    } finally {
      setLoadingCalendar(false);
    }
  };

  useEffect(() => {
    if (showCalendar) loadAttendanceData(selectedMonth, selectedYear);
  }, [showCalendar, selectedMonth, selectedYear]);

  const handleMonthChange = (monthObj: { month: number; year: number }) => {
    const newDate = `${monthObj.year}-${String(monthObj.month).padStart(
      2,
      "0"
    )}-01`;
    setSelectedMonth(monthObj.month);
    setSelectedYear(monthObj.year);
    setCurrentDate(newDate);
    loadAttendanceData(monthObj.month, monthObj.year);
  };

  const markPrev5DaysData = async () => {
    await markSatisfiedTo5DaysData();
    const data = await recentWorkResonseStatus();
    setWorkHistory(data ? data.data : null);
  };

  const closeReportModal = () => {
    setReportModalVisible(false);
    setReportingWorkId(null);
    setSelectedReason(null);
    setReportDescription("");
  };

  useEffect(() => {
    markPrev5DaysData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: WorkStatus) => {
    try {
      setWorkHistory((currentHistory) =>
        currentHistory.map((work) =>
          work.id === id ? { ...work, status: newStatus } : work
        )
      );
      await updateResponse(
        id,
        newStatus,
        selectedReason ? selectedReason?.toLowerCase() : "",
        reportDescription
      );
    } catch (error: any) {
      console.error("Error updating status:", error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
      });
    }
  };

  const openReportModal = (id: string) => {
    setReportingWorkId(id);
    setReportModalVisible(true);
  };

  const handleDownloadReceipt = async (id: string) => {
    try {
      const data = await getPDFdata(id);
      setReceiptData(data.data);
      Toast.show({
        type: "success",
        text1: "Receipt Data Loaded ✅",
        text2: "You can now download the receipt.",
      });
    } catch (error: any) {
      console.error("Error fetching receipt data:", error);
      Toast.show({
        type: "error",
        text1: "Something Went Wrong!",
      });
    }
  };

  const handleSubmitReport = () => {
    if (reportingWorkId && selectedReason) {
      handleUpdateStatus(reportingWorkId, "report");
      closeReportModal();
      Toast.show({
        type: "success",
        text1: "Report Submitted ✅",
        text2: "Your report has been submitted.",
      });
    } else {
      Toast.show({
        type: "info",
        text1: "Missing Info 📝",
        text2: "Please select a reason for the report.",
      });
    }
  };

  const handleDayPress = (day: any) => {
    router.push(`/attendance-data/${day.dateString}`);
    setShowCalendar(false);
  };
  const pendingActionsCount =
    workHistory && workHistory.filter((w) => w.status === "pending").length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <LinearGradient
            colors={["#00C6FF", "#0072FF"]}
            style={styles.headerGradient}
          >
            <View>
              <Text style={styles.headerGreeting}>{greeting}</Text>
              <Text style={styles.headerTitle}>Your Dashboard</Text>
            </View>
            <View style={styles.headerActionCard}>
              <MaterialIcons
                name="pending-actions"
                size={moderateScale(24)}
                color="#F39C12"
              />
              <Text style={styles.headerActionText}>
                You have{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {pendingActionsCount ? pendingActionsCount : 0} pending items
                </Text>{" "}
                to review.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
              style={{
                position: "absolute",
                top: Platform.OS === "ios" ? 80 : 70,
                right: 20,
                backgroundColor: "#ffffff33",
                padding: 10,
                borderRadius: 50,
              }}
            >
              <MaterialIcons name="calendar-month" size={26} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Recent Activity (Last 5 Days)
              </Text>

              {workHistory &&
                workHistory.map((work) => {
                  const statusConfig = {
                    pending: {
                      color: "#F39C12",
                      icon: "hourglass-empty",
                      text: "Pending",
                    },
                    satisfied: {
                      color: "#2ECC71",
                      icon: "check-circle",
                      text: "Satisfied",
                    },
                    report: {
                      color: "#E74C3C",
                      icon: "report-problem",
                      text: "Reported",
                    },
                  }[work.status];

                  return (
                    <View key={work.id} style={styles.workCard}>
                      <View style={styles.workRow}>
                        <View style={styles.workDetails}>
                          <Text style={styles.workOrg}>
                            {work.organizationName}
                          </Text>
                          <Text style={styles.workDate}>
                            {new Date(work.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </Text>
                          <Text style={styles.workTime}>
                            {`${work.startTime} - ${work.endTime}`}
                          </Text>
                        </View>
                        <View style={styles.wageInfo}>
                          <Text style={styles.wageValue}>
                            ₹{Math.round(work.wages)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.actionBar}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: `${statusConfig?.color}20` },
                          ]}
                        >
                          <MaterialIcons
                            name={statusConfig?.icon as any}
                            size={moderateScale(14)}
                            color={statusConfig?.color}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: statusConfig?.color },
                            ]}
                          >
                            {statusConfig?.text}
                          </Text>
                        </View>

                        {work.status === "pending" && (
                          <View style={styles.buttonGroup}>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.reportButton]}
                              onPress={() => openReportModal(work.id)}
                            >
                              <MaterialIcons
                                name="flag"
                                size={moderateScale(16)}
                                color="#E74C3C"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.actionButton, styles.verifyButton]}
                              onPress={() =>
                                handleUpdateStatus(work.id, "satisfied")
                              }
                            >
                              <MaterialIcons
                                name="check"
                                size={moderateScale(16)}
                                color="#FFFFFF"
                              />
                              <Text style={styles.verifyButtonText}>
                                Verify
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {work.status === "satisfied" && (
                          <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={() =>
                              receiptData
                                ? generatePDF(
                                    receiptData,
                                    require("../../assets/images/logo.png")
                                  )
                                : handleDownloadReceipt(work.id)
                            }
                          >
                            <MaterialIcons
                              name="file-download"
                              size={moderateScale(16)}
                              color="#3498DB"
                            />
                            <Text style={styles.downloadButtonText}>
                              {receiptData ? `Download` : `Receipt`}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={isReportModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeReportModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report an Issue</Text>
              <Text style={styles.modalSubtitle}>
                Please select a reason for your report.
              </Text>

              <View style={styles.reasonsContainer}>
                {(
                  [
                    "Salary",
                    "Attendance",
                    "Behaviour",
                    "Other",
                  ] as ReportReason[]
                ).map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonButton,
                      selectedReason === reason && styles.reasonButtonActive,
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    <Text
                      style={[
                        styles.reasonButtonText,
                        selectedReason === reason &&
                          styles.reasonButtonTextActive,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe the issue (optional)..."
                placeholderTextColor="#99A3A4"
                multiline
                value={reportDescription}
                onChangeText={setReportDescription}
              />

              <View style={styles.modalActionsContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeReportModal}
                >
                  <Text
                    style={[styles.modalButtonText, styles.cancelButtonText]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleSubmitReport}
                >
                  <Text style={styles.modalButtonText}>Submit Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showCalendar} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </TouchableWithoutFeedback>

          <View
            style={{
              position: "absolute",
              top: "15%",
              left: 20,
              right: 20,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 15,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Attendance Overview
            </Text>

            {loadingCalendar ? (
              <ActivityIndicator
                size="large"
                color="#0072FF"
                style={{ marginVertical: 20 }}
              />
            ) : (
              <Calendar
                onDayPress={handleDayPress}
                current={currentDate}
                markingType="multi-dot"
                markedDates={markedDates}
                onMonthChange={handleMonthChange}
                minDate={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                    .toISOString()
                    .split("T")[0]
                }
                maxDate={new Date().toISOString().split("T")[0]}
                theme={{
                  arrowColor: "#0072FF",
                  todayTextColor: "#0072FF",
                  monthTextColor: "#333",
                  textDayFontSize: 15,
                  textDayFontWeight: "500",
                  textMonthFontSize: 18,
                  textMonthFontWeight: "bold",
                  backgroundColor: "#fff",
                  calendarBackground: "#fff",
                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 15,
                paddingTop: 10,
                borderTopWidth: 1,
                borderColor: "#eee",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#4CAF50",
                  }}
                />
                <Text style={{ marginLeft: 5 }}>Present</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#E53935",
                  }}
                />
                <Text style={{ marginLeft: 5 }}>Absent</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#FFB300",
                  }}
                />
                <Text style={{ marginLeft: 5 }}>Overtime</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              style={{
                backgroundColor: "#0072FF",
                marginTop: 15,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
