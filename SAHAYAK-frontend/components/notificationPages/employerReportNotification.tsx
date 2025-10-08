import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ReportPopupProps {
  visible: boolean;
  onClose: () => void;
  reportCount: number;
}

export default function ReportPopup({
  visible,
  onClose,
  reportCount,
}: ReportPopupProps) {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <View
        style={{
          width: width * 0.85,
          backgroundColor: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          borderWidth: 1,
          justifyContent: "center",
          borderColor: "#e0e0e0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 6,
          elevation: 10,
        }}
      >
        <LinearGradient
          colors={["#8a241bff", "#521d14ff"]}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "700",
              fontSize: 16,
              letterSpacing: 0.3,
            }}
          >
            Important Notice
          </Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: 20,
            paddingHorizontal: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: reportCount > 0 ? "#FFF4E5" : "#E9F8ED",
              borderWidth: 1,
              borderColor: reportCount > 0 ? "#FFD9A0" : "#A8E6A3",
              borderRadius: 10,
              padding: 15,
              width: "100%",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name={reportCount > 0 ? "warning-amber" : "check-circle"}
              size={40}
              color={reportCount > 0 ? "#E67E22" : "#27ae60"}
              style={{ marginBottom: 8 }}
            />

            {reportCount > 0 ? (
              <>
                <Text
                  style={{
                    color: "#D35400",
                    fontWeight: "700",
                    fontSize: 15.5,
                    textAlign: "center",
                    marginBottom: 6,
                  }}
                >
                  You have been reported by workers {reportCount}{" "}
                  {reportCount > 1 ? "times" : "time"}.
                </Text>

                <Text
                  style={{
                    color: "#444",
                    fontSize: 13.5,
                    textAlign: "center",
                    lineHeight: 19,
                  }}
                >
                  Please contact the{" "}
                  <Text style={{ fontWeight: "600", color: "#2C3E50" }}>
                    Super Admin
                  </Text>{" "}
                  for further clarification and investigation.
                </Text>
              </>
            ) : (
              <Text
                style={{
                  color: "#27ae60",
                  fontWeight: "700",
                  fontSize: 15.5,
                  textAlign: "center",
                  marginBottom: 6,
                }}
              >
                Everything looks good — no reports found.
              </Text>
            )}

            <Text
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "#7f8c8d",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              — Issued automatically by the SRAM Monitoring System
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
