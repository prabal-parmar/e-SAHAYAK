import {
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8FA" },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: moderateScale(60),
    paddingHorizontal: moderateScale(25),
    borderBottomLeftRadius: moderateScale(35),
    borderBottomRightRadius: moderateScale(35),
  },
  headerGreeting: {
    fontSize: moderateScale(18),
    color: "rgba(255, 255, 255, 0.8)",
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: moderateScale(4),
  },
  headerActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(14),
    padding: moderateScale(15),
    marginTop: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  headerActionText: {
    flex: 1,
    marginLeft: moderateScale(12),
    fontSize: moderateScale(15),
    color: "#34495E",
  },
  contentContainer: {
    padding: moderateScale(20),
    marginTop: moderateScale(-40),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
    padding: moderateScale(10),
    ...Platform.select({
      ios: {
        shadowColor: "#95A5A6",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: { elevation: 8 },
    }),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2C3E50",
    paddingHorizontal: moderateScale(10),
    paddingTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  workCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    margin: moderateScale(10),
    padding: moderateScale(15),
    borderWidth: 1,
    borderColor: "#EBEDF0",
  },
  workRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  workDetails: { flex: 1 },
  workOrg: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#34495E",
    marginBottom: moderateScale(4),
  },
  workDate: {
    fontSize: moderateScale(14),
    color: "#7A869A",
  },
  workTime: {
    fontSize: moderateScale(13),
    color: "#95A5A6",
    marginTop: moderateScale(4),
    fontWeight: "500",
  },
  wageInfo: { alignItems: "flex-end" },
  wageValue: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: "#2C3E50",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(15),
    paddingTop: moderateScale(15),
    borderTopWidth: 1,
    borderTopColor: "#EBEDF0",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  statusText: {
    marginLeft: 6,
    fontSize: moderateScale(12),
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  actionButton: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  reportButton: {
    backgroundColor: "#FADBD8",
  },
  verifyButton: {
    backgroundColor: "#27AE60",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: moderateScale(14),
    marginLeft: 6,
  },
  downloadButton: {
    backgroundColor: "#D6EAF8",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#2980B9",
    fontWeight: "bold",
    fontSize: moderateScale(14),
    marginLeft: 6,
  },
  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(25),
    width: '100%',
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: moderateScale(14),
    color: '#7A869A',
    textAlign: 'center',
    marginTop: moderateScale(5),
    marginBottom: moderateScale(20),
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: moderateScale(20),
  },
  reasonButton: {
    width: '48%',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
    borderColor: '#EAECEE',
    alignItems: 'center',
    marginBottom: '4%',
  },
  reasonButtonActive: {
    backgroundColor: '#FADBD8',
    borderColor: '#E74C3C',
  },
  reasonButtonText: {
    fontSize: moderateScale(14),
    color: '#34495E',
    fontWeight: '500',
  },
  reasonButtonTextActive: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  descriptionInput: {
    backgroundColor: '#F7F8FA',
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    height: moderateScale(100),
    textAlignVertical: 'top',
    fontSize: moderateScale(15),
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#EAECEE',
    marginBottom: moderateScale(20),
  },
  modalActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ECF0F1',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#E74C3C',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: moderateScale(16),
    color: "#efececff",
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#7F8C8D',
  },
});

