import {Platform, StyleSheet, Dimensions} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F8FA" },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: moderateScale(30),
    paddingHorizontal: moderateScale(25),
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: moderateScale(6),
  },
  contentContainer: {
    padding: moderateScale(20),
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(16),
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
  listHeader: {
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F3F4",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F3F4",
    borderRadius: 10,
    padding: 4,
    alignSelf: "center",
  },
  filterButton: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(8),
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  filterText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#7A869A",
  },
  filterTextActive: {
    color: "#2C3E50",
  },
  reportRow: {
    flexDirection: "row",
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: "#F7F8FA",
    alignItems: "flex-start",
  },
  reportIconContainer: {
    backgroundColor: "#FADBD8",
    borderRadius: moderateScale(22.5),
    width: moderateScale(45),
    height: moderateScale(45),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(15),
  },
  reportDetails: {
    flex: 1,
  },
  reportOrg: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: "#34495E",
  },
  reportReason: {
    fontSize: moderateScale(14),
    color: "#E74C3C",
    fontWeight: "600",
    marginTop: moderateScale(2),
  },
  reportDescription: {
    fontSize: moderateScale(14),
    color: "#7A869A",
    fontStyle: "italic",
    marginTop: moderateScale(8),
  },
  reportDate: {
    fontSize: moderateScale(12),
    color: "#95A5A6",
    marginTop: moderateScale(8),
  },
  statusBadge: {
    position: "absolute",
    top: moderateScale(15),
    right: moderateScale(15),
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
  noItemsText: {
    textAlign: "center",
    color: "#7A869A",
    fontSize: moderateScale(16),
    padding: moderateScale(40),
  },
});
