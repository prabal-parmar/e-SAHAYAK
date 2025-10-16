import { StyleSheet, Dimensions } from "react-native";

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
    padding: moderateScale(4),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "600",
    color: "#2C3E50",
  },
  container: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(30),
  },
  label: {
    fontSize: moderateScale(15),
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: moderateScale(6),
    marginTop: moderateScale(20),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: moderateScale(12),
    height: moderateScale(50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15),
    color: "#2C3E50",
  },
  button: {
    backgroundColor: "#FF8C00",
    marginTop: moderateScale(35),
    borderRadius: 10,
    height: moderateScale(50),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF8C00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
});
