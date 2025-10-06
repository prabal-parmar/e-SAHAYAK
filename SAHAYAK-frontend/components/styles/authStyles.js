import { StyleSheet, Dimensions, Platform } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

const COLORS = {
  saffron: "#ff9327ff",
  white: "#FFFFFF",
  green: "#138808",
  navy: "#000080",

  primaryText: "#2C3E50",
  secondaryText: '#7A869A',
  lightBackground: "#FFFFFF",
  lightGrey: "#F0F2F5",

  landingPrimaryText: "#FFFFFF",
  landingSecondaryText: 'rgba(255, 255, 255, 0.9)',
  landingCardBackground: "rgba(0, 0, 0, 0.3)",
  cardBackground: 'rgba(255, 255, 255, 0.2)',
  cardBorder: 'rgba(255, 255, 255, 0.3)',
  formBackground: '#FFFFFF',
  formPrimaryText: '#2C3E50',
  formSecondaryText: '#7A869A',
  formLightGrey: '#F0F2F5',
  iconBackground: 'rgba(255, 255, 255, 0.15)',
};

const FONTS = {
  regular: "System",
  bold: "System",
  medium: "System",
};

const SIZES = {
  h1: 32,
  h2: 24,
  h3: 18,
  body: 16,
  caption: 14,
  small: 12,
};

const guidelineBaseWidth = 375;
const scale = (size) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const landingStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(14),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: moderateScale(12),
  },
  headerText: {
    color: COLORS.landingPrimaryText,
    fontWeight: "bold",
    fontSize: moderateScale(13), // Scaled font size
    ...Platform.select({
      native: {
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      web: {
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  subHeaderText: {
    color: COLORS.landingSecondaryText,
    fontSize: moderateScale(11),
  },
  mainTitle: {
    color: COLORS.landingPrimaryText,
    // Scale large fonts less aggressively to avoid them being oversized on tablets
    fontSize: moderateScale(48, 0.3), 
    fontWeight: "bold",
    marginBottom: moderateScale(8),
    ...Platform.select({
      native: {
        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
      },
      web: {
        textShadow: "2px 2px 5px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  subTitle: {
    color: COLORS.landingPrimaryText,
    fontSize: moderateScale(20),
    fontWeight: "500",
    marginBottom: moderateScale(4),
  },
  subTitleEnglish: {
    color: COLORS.landingSecondaryText,
    fontSize: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  description: {
    color: COLORS.landingSecondaryText,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginBottom: moderateScale(30),
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    backgroundColor: COLORS.landingCardBackground,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    width: '48.5%', 
    marginBottom: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    minHeight: moderateScale(120),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    marginBottom: moderateScale(12),
  },
  cardText: {
    color: COLORS.landingPrimaryText,
    textAlign: "center",
    fontSize: moderateScale(14),
    fontWeight: "500",
  },
  footerContainer: {
    marginTop: moderateScale(20),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: COLORS.landingSecondaryText,
    fontSize: moderateScale(12),
    marginHorizontal: moderateScale(8),
  },
});

export const loginStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
      web: {
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.body,
    color: COLORS.primaryText,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  titleHindi: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.primaryText,
    fontWeight: "700",
  },
  titleEnglish: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.h3,
    color: COLORS.secondaryText,
    marginTop: 4,
    fontWeight: "500",
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body,
    color: COLORS.secondaryText,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  toggleContainer: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.lightGrey,
    borderRadius: 12,
    marginBottom: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
      },
    }),
  },
  toggleButtonIcon: {
    marginRight: 8,
    width: 20,
    height: 20,
  },
  toggleButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body,
    color: COLORS.secondaryText,
    fontWeight: "500",
    paddingLeft: 2,
  },
  toggleButtonTextActive: {
    color: COLORS.primaryText,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.caption,
    color: COLORS.primaryText,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: SIZES.body,
    fontFamily: FONTS.regular,
    color: COLORS.primaryText,
  },
  inputFocused: {
    borderColor: COLORS.navy,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.navy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0 2px 4px rgba(0, 0, 128, 0.2)`,
      },
    }),
  },
  loginButton: {
    width: "100%",
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      android: {
        elevation: 7,
      },
      web: {
        boxShadow: `0 4px 5px rgba(19, 136, 8, 0.4)`,
      },
    }),
  },
  loginButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.white,
    fontWeight: "700",
  },
  loginButtonSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.secondaryText,
    marginTop: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  secureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  secureIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  secureText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.secondaryText,
  },
  helpText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 18,
  },
  registerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  registerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.caption,
    color: COLORS.secondaryText,
  },
  registerLink: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.caption,
    color: COLORS.navy,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export const register = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: moderateScale(20),
  },
  formContainer: {
    backgroundColor: COLORS.formBackground,
    borderRadius: 20,
    padding: moderateScale(24),
    width: '100%',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: moderateScale(20),
  },
  backButtonText: {
    color: COLORS.navy,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  formTitle: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: COLORS.formPrimaryText,
    textAlign: 'center',
    marginBottom: moderateScale(25),
  },
  inputContainer: {
    width: '100%',
    marginBottom: moderateScale(18),
  },
  splitInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(18),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    color: COLORS.formPrimaryText,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.formLightGrey,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: moderateScale(16),
    color: COLORS.formPrimaryText,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.formLightGrey,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: COLORS.formLightGrey,
  },
  genderButtonActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  genderButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.formPrimaryText,
  },
  genderButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  registerButton: {
    width: '100%',
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: moderateScale(25),
  },
  registerButtonText: {
    fontSize: moderateScale(18),
    color: COLORS.white,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(25),
  },
  loginText: {
    fontSize: moderateScale(14),
    color: COLORS.formSecondaryText,
  },
  loginLink: {
    fontSize: moderateScale(14),
    color: COLORS.navy,
    fontWeight: '600',
    marginLeft: 5,
  },
  landingContainer: {
    alignItems: 'center',
    padding: moderateScale(10),
    justifyContent: 'center',
    minHeight: '100%',
  },
  landingLogo: {
    width: moderateScale(70),
    height: moderateScale(70),
    marginBottom: moderateScale(20),
  },
  mainTitle: {
    color: COLORS.primaryText,
    fontSize: moderateScale(36, 0.3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: moderateScale(12),
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  description: {
    color: "#ffff",
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    textAlign: 'center',
    marginBottom: moderateScale(35),
    maxWidth: '90%',
  },
  roleCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    width: '100%',
    marginBottom: moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(20),
  },
  cardIcon: {
    fontSize: moderateScale(30),
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.primaryText,
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateScale(6),
  },
  cardDescription: {
    color: "#ffff",
    fontSize: moderateScale(10),
    lineHeight: moderateScale(20),
  },
    loginButton: {
    marginTop: 20,
    backgroundColor: "#3d322580", 
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

