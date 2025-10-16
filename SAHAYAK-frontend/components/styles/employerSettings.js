import { StyleSheet, Platform, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: moderateScale(10),
    padding: 4,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#2C3E50",
  },
  container: {
    backgroundColor: "#FFFFFF",
    marginTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
    marginRight: moderateScale(15),
  },
  optionText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: "#2C3E50",
    fontWeight: "500",
  },
});
