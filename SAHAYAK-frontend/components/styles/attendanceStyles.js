import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputGroup: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#7A869A",
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: "#F4F7FC",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E6ED",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  noAttendanceContainer: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noAttendanceText: {
    color: "#7A869A",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6ED",
  },
  modalItemText: {
    fontSize: 16,
  },

  shiftSection: {
    marginBottom: 10,
  },

  shiftHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
    padding: 15,
    borderRadius: 10,
  },

  shiftHeaderTitle: {
    flexDirection: "row",
    alignItems: "center",
  },

  shiftName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },

  workerCountBadge: {
    backgroundColor: "#3498DB",
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  workerCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  // The '+' or '−' icon
  expandIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7A869A",
  },

  shiftContent: {
    paddingTop: 5,
    paddingHorizontal: 5,
  },

  attendanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicatorGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ECC71",
    marginRight: 12,
  },
  statusIndicatorRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#cc382eff",
    marginRight: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495E",
  },
  workerDetail: {
    fontSize: 13,
    color: "#7A869A",
    marginTop: 2,
  },
  timeInfo: {
    alignItems: "flex-end",
  },
  timeLabel: {
    fontSize: 12,
    color: "#7A869A",
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#34495E",
    marginTop: 2,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 25,
    // borderBottomLeftRadius: 35,
    // borderBottomRightRadius: 35,
    height: "25.5%",
    ...Platform.select({
      ios: {
        shadowColor: "#2c3e50",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
  },
  headerTopContent: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 6,
  },
  headerStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  statSeparator: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 350,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 15 },
      android: { elevation: 10 },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F3F4',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#3498DB',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#7A869A',
  },
});
