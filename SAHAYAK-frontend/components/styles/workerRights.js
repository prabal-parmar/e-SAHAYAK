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
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(20),
    backgroundColor: "#FFFFFF",
  },
  intro: {
    fontSize: moderateScale(15.5),
    color: "#34495E",
    marginBottom: moderateScale(18),
    lineHeight: moderateScale(23),
    textAlign: "justify",
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: "700",
    color: "#1A5276",
    marginTop: moderateScale(18),
    marginBottom: moderateScale(8),
  },
  text: {
    fontSize: moderateScale(15),
    color: "#2C3E50",
    lineHeight: moderateScale(23),
    marginBottom: moderateScale(4),
    textAlign: "justify",
  },
  highlight: {
    color: "#E67E22",
    fontWeight: "600",
  },
  important: {
    color: "#D35400",
    fontWeight: "700",
  },
  bold: {
    fontWeight: "700",
    color: "#2C3E50",
  },
  note: {
    backgroundColor: "#FFF6E5",
    borderLeftWidth: 4,
    borderLeftColor: "#E67E22",
    padding: moderateScale(12),
    marginTop: moderateScale(25),
    borderRadius: 8,
    color: "#6C5B7B",
    fontSize: moderateScale(14.5),
    lineHeight: moderateScale(21),
  },
});
