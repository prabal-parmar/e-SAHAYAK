import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getWorkerRegistrationTypes,
  registerWorkerExtended,
} from "@/api/Worker/registration_routes";
import { useRouter } from "expo-router";

type Field = { name: string; label: string; type: string; required: boolean };
type RegType = { key: string; title: string; required_fields: Field[] };

export default function ClusterRegister() {
  const [types, setTypes] = useState<RegType[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const t = await getWorkerRegistrationTypes();
        setTypes(t);
        if (!selected && t && t.length > 0) {
          setSelected(t[0].key);
        }
      } catch {
        setTypes([
          {
            key: "basic",
            title: "Basic Registration",
            required_fields: [
              {
                name: "first_name",
                label: "First Name",
                type: "string",
                required: true,
              },
              {
                name: "last_name",
                label: "Last Name",
                type: "string",
                required: true,
              },
              {
                name: "contact_number",
                label: "Mobile",
                type: "string",
                required: true,
              },
            ],
          },
        ]);
      }
    })();
  }, []);

  const fields = useMemo(
    () => types?.find((t) => t.key === selected)?.required_fields || [],
    [types, selected]
  );
  // Do not ask for base account fields already collected in the main Worker form
  const baseFields = useMemo(
    () =>
      new Set([
        "first_name",
        "last_name",
        "contact_number",
        "username",
        "password",
        "address",
        "email",
        "gender",
        "skill",
      ]),
    []
  );
  const displayedFields = useMemo(
    () =>
      fields
        .filter((f) => !baseFields.has(f.name))
        .filter((f) => (showOptional ? true : f.required)),
    [fields, showOptional, baseFields]
  );

  const update = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const onSubmit = async () => {
    if (!selected) {
      Alert.alert("Select Type", "Please choose a registration type.");
      return;
    }
    for (const f of displayedFields) {
      if (f.required && !form[f.name]) {
        Alert.alert("Missing Field", `${f.label} is required.`);
        return;
      }
    }
    const payload = { registration_type: selected, ...form };
    const res = await registerWorkerExtended(payload);
    Alert.alert("Success", "Registration submitted.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          backgroundColor: "#1d4ed8",
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: "#1e40af",
            marginRight: 10,
          }}
        >
          <Text style={{ fontWeight: "800", color: "#fff" }}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff" }}>
          Worker Registration
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 8,
            color: "#111827",
          }}
        >
          Choose Registration Type
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {types?.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => {
                setSelected(t.key);
                setForm({});
                setShowOptional(false);
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: selected === t.key ? "#2563eb" : "#e5e7eb",
                backgroundColor: selected === t.key ? "#dbeafe" : "#fff",
              }}
            >
              <Text style={{ color: "#111827" }}>{t.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {fields.length > 0 && (
          <View style={{ gap: 12 }}>
            {/* Optional fields toggle */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text style={{ fontWeight: "700", color: "#374151" }}>
                {showOptional
                  ? "Showing all fields"
                  : "Showing required fields only"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowOptional((v) => !v)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: "#f3f4f6",
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <Text style={{ fontWeight: "700", color: "#111827" }}>
                  {showOptional ? "Hide Optional" : "Add Optional Fields"}
                </Text>
              </TouchableOpacity>
            </View>

            {displayedFields.length === 0 && (
              <View
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "#f9fafb",
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#374151" }}>
                  No additional fields required for this registration type. You
                  can submit to proceed.
                </Text>
              </View>
            )}

            {displayedFields.map((f) => (
              <View key={f.name}>
                <Text style={{ marginBottom: 6, fontWeight: "600" }}>
                  {f.label}
                  {f.required ? " *" : ""}
                </Text>
                <TextInput
                  value={form[f.name] || ""}
                  onChangeText={(v) => update(f.name, v)}
                  placeholder={f.label}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: "#ffffff",
                  }}
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={onSubmit}
          style={{
            marginTop: 20,
            backgroundColor: "#2563eb",
            borderRadius: 10,
            paddingVertical: 14,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "700" }}
          >
            Submit Registration
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
