import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: "600" }}
      text2Style={{ fontSize: 13, color: "gray" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: "600" }}
      text2Style={{ fontSize: 13, color: "gray" }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "blue", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: "600" }}
      text2Style={{ fontSize: 13, color: "gray" }}
    />
  ),
};
