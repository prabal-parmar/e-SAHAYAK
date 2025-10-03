import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    color: '#7A869A',
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#F4F7FC',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noAttendanceContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAttendanceText: {
    color: '#7A869A',
    fontSize: 16,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  modalItemText: {
    fontSize: 16,
  },

shiftSection: {
    marginBottom: 10,
},

// The tappable header for each shift
shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F7FC', // A light background to stand out
    padding: 15,
    borderRadius: 10,
},

// Groups the shift name and worker count badge together
shiftHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
},

// Style for the text "Shift 1", "Shift 2", etc.
shiftName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
},

// The small circle showing the number of workers
workerCountBadge: {
    backgroundColor: '#3498DB', // A pleasant blue
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
},

// The number inside the badge
workerCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
},

// The '+' or '−' icon
expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7A869A',
},

// The container for the list of workers that expands/collapses
shiftContent: {
    paddingTop: 5,
    paddingHorizontal: 5,
},

// --- Re-used styles from previous design (keep these as they are) ---
attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
},
workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
},
statusIndicatorGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
    marginRight: 12,
},
statusIndicatorRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cc382eff',
    marginRight: 12,
},
workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
},
workerDetail: {
    fontSize: 13,
    color: '#7A869A',
    marginTop: 2,
},
timeInfo: {
    alignItems: 'flex-end',
},
timeLabel: {
    fontSize: 12,
    color: '#7A869A',
},
timeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34495E',
    marginTop: 2,
},
});