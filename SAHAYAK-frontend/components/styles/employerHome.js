import { Dimensions, Platform, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;


export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7FC' },
  scrollContainer: { paddingBottom: moderateScale(40) },
  header: {
      paddingHorizontal: moderateScale(20),
      paddingTop: Platform.OS === 'ios' ? moderateScale(50) : moderateScale(40),
      paddingBottom: moderateScale(20),
      borderBottomLeftRadius: moderateScale(30),
      borderBottomRightRadius: moderateScale(30),
  },
  headerTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  headerGreeting: {
      fontSize: moderateScale(18),
      color: 'rgba(255,255,255,0.8)',
  },
  headerName: {
      fontSize: moderateScale(26, 0.4),
      fontWeight: 'bold',
      color: '#FFFFFF',
  },
  headerAvatarContainer: {
      width: moderateScale(60),
      height: moderateScale(60),
      borderRadius: moderateScale(30),
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  headerAvatarText: {
      color: '#FFFFFF',
      fontSize: moderateScale(22),
      fontWeight: 'bold',
  },
  headerBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: moderateScale(20),
  },
  headerDate: {
      fontSize: moderateScale(14),
      color: '#FFFFFF',
  },
  headerTime: {
      fontSize: moderateScale(14),
      fontWeight: 'bold',
      color: '#FFFFFF',
  },
  statsContainer: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(20),
  },
  statCard: {
      borderRadius: moderateScale(16),
      padding: moderateScale(15),
      marginRight: moderateScale(15),
      width: scale(160),
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
        android: { elevation: 5 },
      }),
  },
  statIconContainer: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: moderateScale(12),
      padding: moderateScale(10),
      marginRight: moderateScale(12),
  },
  statValue: {
      fontSize: moderateScale(22),
      fontWeight: 'bold',
      color: '#FFFFFF',
  },
  statLabel: {
      fontSize: moderateScale(14),
      color: 'rgba(255,255,255,0.8)',
      marginTop: moderateScale(2),
  },
  listHeader: {
      paddingHorizontal: moderateScale(20),
      marginTop: moderateScale(10),
  },
  sectionTitle: {
      fontSize: moderateScale(22),
      fontWeight: 'bold',
      color: '#2C3E50',
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(12),
      paddingHorizontal: moderateScale(15),
      marginTop: moderateScale(15),
      borderWidth: 1,
      borderColor: '#E0E6ED',
  },
  searchIcon: { marginRight: moderateScale(10) },
  searchInput: {
      flex: 1,
      height: moderateScale(50),
      fontSize: moderateScale(16),
      color: '#2C3E50',
  },
  noResultsContainer: { alignItems: 'center', padding: moderateScale(30) },
  noResultsText: { fontSize: moderateScale(16), color: '#7A869A' },
  shiftSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(12),
      marginHorizontal: moderateScale(20),
      marginTop: moderateScale(20),
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
        android: { elevation: 3 },
      }),
  },
  shiftHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: moderateScale(15),
  },
  shiftHeaderTitle: { flexDirection: 'row', alignItems: 'center' },
  shiftName: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#2C3E50' },
  workerCountBadge: {
      backgroundColor: '#3498DB',
      borderRadius: moderateScale(12),
      marginLeft: moderateScale(10),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(4),
  },
  workerCountText: { color: '#FFFFFF', fontSize: moderateScale(12), fontWeight: 'bold' },
  shiftContent: { paddingTop: moderateScale(5) },
  attendanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: moderateScale(15),
      borderTopWidth: 1,
      borderTopColor: '#F0F2F5',
  },
  workerAvatar: {
      width: moderateScale(45),
      height: moderateScale(45),
      borderRadius: moderateScale(22.5),
      marginRight: moderateScale(15),
  },
  workerInfo: { flex: 1 },
  workerName: { fontSize: moderateScale(16), fontWeight: '600', color: '#34495E' },
  workerDetail: { fontSize: moderateScale(14), color: '#7A869A', marginTop: moderateScale(2) },
  timeInfo: { alignItems: 'flex-end' },
  timeLabel: { fontSize: moderateScale(12), color: '#7A869A' },
  timeValue: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#34495E', marginTop: moderateScale(2), minWidth: scale(70), textAlign: 'right' },
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
});

