import { Platform, StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  contentContainer: {
    padding: 20,
    marginTop: -50,
  },
  headerGradient: {
    height: "25.5%",
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  skill: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 4,
    flexShrink: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  infoIconContainer: {
    marginRight: 20,
    width: 30,
    alignItems: "center",
    marginTop: 3,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#7A869A",
  },
  infoValue: {
    fontSize: 16,
    color: "#34495E",
    fontWeight: "500",
    marginTop: 4,
  },
  input: {
    fontSize: 16,
    color: "#34495E",
    fontWeight: "500",
    marginTop: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: "#BDC3C7",
    paddingBottom: 6,
  },
  genderSelectorContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#ECF0F1",
    alignItems: "center",
    marginHorizontal: 4,
  },
  genderButtonActive: {
    backgroundColor: "#16A085",
    borderColor: "#16A085",
  },
  genderButtonText: {
    fontSize: 14,
    color: "#7A869A",
    fontWeight: "500",
  },
  genderButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3498DB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
  },
  logoutButtonText: {
    color: "#FFFFFF",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#aeb0b0ff",
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
  },
});
