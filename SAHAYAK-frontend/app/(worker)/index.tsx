import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../components/styles/workerHome";
import { markSatisfiedTo5DaysData, recentWorkResonseStatus, updateResponse } from "@/api/Worker/home_routes";
import { generatePDF } from "@/components/receiptDownload/workReceipt";
import { getPDFdata } from "@/api/Worker/get_pdf_data";

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


export default function WorkerHomePage() {
  const [workHistory, setWorkHistory] = useState<WorkEntry[]>([]);
  const [greeting, setGreeting] = useState("Welcome");
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [reportingWorkId, setReportingWorkId] = useState<string | null>(null);
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [reportDescription, setReportDescription] = useState("");
  const [receiptData, setReceiptData] = useState(null)

  const markPrev5DaysData = async () => {
    await markSatisfiedTo5DaysData();
    const data = await recentWorkResonseStatus();
    setWorkHistory(data ? data.data: null)
  }

  const closeReportModal = () => {
    setReportModalVisible(false);
    setReportingWorkId(null);
    setSelectedReason(null);
    setReportDescription("");
  };

  useEffect(() => {
    markPrev5DaysData()
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: WorkStatus) => {
    setWorkHistory((currentHistory) =>
      currentHistory.map((work) =>
        work.id === id ? { ...work, status: newStatus } : work
      )
    );
    await updateResponse(id, newStatus, (selectedReason ? selectedReason?.toLowerCase() : ""), reportDescription)
  };

  const openReportModal = (id: string) => {
    setReportingWorkId(id);
    setReportModalVisible(true);
  };

  const handleDownloadReceipt = async (id: string) => {
    const data = await getPDFdata(id);
    setReceiptData(data.data)
  };

  const handleSubmitReport = () => {
    if (reportingWorkId && selectedReason) {
      handleUpdateStatus(reportingWorkId, "report");
      closeReportModal();
    } else {
      alert("Please select a reason for the report.");
    }
  };
  
  const pendingActionsCount = workHistory && workHistory.filter(
    (w) => w.status === "pending"
  ).length;

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
                {pendingActionsCount} pending items
              </Text>{" "}
              to review.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Recent Activity (Last 5 Days)
            </Text>

            {workHistory && workHistory.map((work) => {
              const statusConfig = {
                pending: { color: "#F39C12", icon: "hourglass-empty", text: "Pending" },
                satisfied: { color: "#2ECC71", icon: "check-circle", text: "Satisfied" },
                report: { color: "#E74C3C", icon: "report-problem", text: "Reported" },
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
                      <Text style={styles.wageValue}>₹{Math.round(work.wages)}</Text>
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
                      <Text style={[ styles.statusText, { color: statusConfig?.color } ]}>
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
                          <Text style={styles.verifyButtonText}>Verify</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {work.status === "satisfied" && (
                      <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => receiptData ? generatePDF(receiptData, require('../../assets/images/logo.png')) : handleDownloadReceipt(work.id)}
                      >
                        <MaterialIcons
                          name="file-download"
                          size={moderateScale(16)}
                          color="#3498DB"
                        />
                        <Text style={styles.downloadButtonText}>{receiptData ? `Download`: `Receipt`}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal visible={isReportModalVisible} transparent animationType="fade" onRequestClose={closeReportModal}>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Report an Issue</Text>
                  <Text style={styles.modalSubtitle}>Please select a reason for your report.</Text>

                  <View style={styles.reasonsContainer}>
                      {(["Salary", "Attendance", "Behaviour", "Other"] as ReportReason[]).map(reason => (
                          <TouchableOpacity 
                              key={reason}
                              style={[styles.reasonButton, selectedReason === reason && styles.reasonButtonActive]}
                              onPress={() => setSelectedReason(reason)}
                          >
                              <Text style={[styles.reasonButtonText, selectedReason === reason && styles.reasonButtonTextActive]}>{reason}</Text>
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
                      <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeReportModal}>
                          <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmitReport}>
                          <Text style={styles.modalButtonText}>Submit Report</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

    </SafeAreaView>
    </SafeAreaProvider>
  );
}