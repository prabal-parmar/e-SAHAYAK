import {Platform,StyleSheet,Dimensions} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? moderateScale(60) : moderateScale(50),
    paddingBottom: moderateScale(60),
    paddingHorizontal: moderateScale(25),
  },
  headerGreeting: {
    fontSize: moderateScale(18),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: moderateScale(4),
  },
  contentContainer: {
    padding: moderateScale(15),
    marginTop: moderateScale(-50),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: moderateScale(15),
    gap: moderateScale(10),
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    flex: 1,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#95A5A6', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15 },
      android: { elevation: 8 },
    }),
  },
  statIconContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(10),
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statTextContainer: {
      alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: moderateScale(13),
    color: '#7A869A',
    marginTop: moderateScale(4),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(20),
    ...Platform.select({
      ios: { shadowColor: '#95A5A6', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 15 },
      android: { elevation: 8 },
    }),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: moderateScale(10),
  },
  chartContainer: {
    height: moderateScale(160),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: moderateScale(20),
  },
  barWrapper: { flex: 1, alignItems: 'center' },
  bar: {
    width: '35%',
    backgroundColor: '#D6EAF8',
    borderRadius: 6,
  },
  barLabel: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(12),
    color: '#7A869A',
  },
  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F7F8FA',
  },
  workIconContainer: {
    backgroundColor: '#EAECEE',
    borderRadius: moderateScale(22.5),
    width: moderateScale(45),
    height: moderateScale(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(15),
  },
  workDetails: { flex: 1 },
  workOrg: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#34495E',
  },
  workDate: {
    fontSize: moderateScale(14),
    color: '#7A869A',
    marginTop: moderateScale(2),
  },
  satisfactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: moderateScale(6),
  },
  satisfactionText: {
    marginLeft: 6,
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  wageInfo: { alignItems: 'flex-end' },
  wageValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#D35400',
  },
  wageLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: moderateScale(2),
    color: '#E67E22',
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#7A869A',
    fontSize: moderateScale(15),
    paddingVertical: moderateScale(30),
  },
});

