import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFD",
  },

  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
  },

  loadingText: {
    marginTop: 10,
    color: "#333",
  },

  noDataText: {
    fontSize: 16,
    color: "#555",
  },

  backLink: {
    color: "#0072FF",
    marginTop: 10,
    fontWeight: "600",
  },

  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#0072FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    padding: 5,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },

  headerDate: {
    color: "#e6faff",
    marginTop: 8,
    fontSize: 14,
  },

  scrollContainer: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  detailLabel: {
    color: "#6B7280",
    fontSize: 15,
  },

  detailValue: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  overtimeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0072FF",
    marginBottom: 6,
  },

  totalText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "right",
  },
});
