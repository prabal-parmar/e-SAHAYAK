import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  scrollContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  organization: {
    fontSize: 16,
    color: '#7A869A',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 20,
    width: 30,
    textAlign: 'center',
    marginTop: 5,
    color: '#7A869A'
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7A869A',
  },
  infoValue: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
    marginTop: 4,
  },
  input: {
      fontSize: 16,
      color: '#34495E',
      fontWeight: '500',
      marginTop: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E6ED',
      paddingBottom: 6,
  },
  button: {
    backgroundColor: '#3498DB', // A pleasant blue
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E74C3C', // A distinct red for logout
  },
  logoutButtonText: {
    color: '#FFFFFF',
  },
  actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  saveButton: {
      backgroundColor: '#2ECC71', // Green for save
      flex: 1,
      marginLeft: 10,
  },
  cancelButton: {
      backgroundColor: '#bdc3c7', // Grey for cancel
      flex: 1,
      marginRight: 10,
  },
  cancelButtonText: {
      color: '#2c3e50',
  },
});