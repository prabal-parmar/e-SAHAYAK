import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
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
  infoIcon: {
    fontSize: 24,
    marginRight: 20,
    width: 30,
    textAlign: "center",
    marginTop: 5,
    color: "#7A869A",
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
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6ED",
    paddingBottom: 6,
  },
  button: {
    backgroundColor: "#3498DB",
    borderRadius: 10,
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
    backgroundColor: "#bdc3c7",
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#2c3e50",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4, // for Android shadow
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  organization: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  profileHeaderGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 30,
    paddingHorizontal: 25,
    // borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginBottom: 30,
    height: "25.5%",
    ...Platform.select({
      ios: { 
        shadowColor: '#16A085', 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 20 
      },
      android: { 
        elevation: 10 
      },
    }),
},

profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
},

profileAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e7e4edff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
},

profileAvatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
},

profileHeaderTextContainer: {
    flex: 1, // Allows text to wrap if needed
},

profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
},

profileOrganization: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
    flexShrink: 1, // Ensures organization name wraps if too long
},
});
