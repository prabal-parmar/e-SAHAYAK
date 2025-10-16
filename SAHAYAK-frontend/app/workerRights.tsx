import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from '../components/styles/workerRights';

export default function WorkerRightsPage() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={26} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Rights</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.intro}>
          Every worker in{" "}
          <Text style={styles.bold}>Madhya Pradesh</Text> is protected under the{" "}
          <Text style={styles.bold}>Labour Laws of India</Text> and the{" "}
          <Text style={styles.bold}>Madhya Pradesh Shops & Establishments Act</Text>.
          These laws ensure fair treatment, safety, and dignity for every worker.
        </Text>

        <Text style={styles.sectionTitle}>1️⃣ Right to Fair Wages</Text>
        <Text style={styles.text}>
          Workers have the right to receive at least the{" "}
          <Text style={styles.highlight}>minimum wage</Text> as notified by the
          Madhya Pradesh Government. Employers cannot pay less than this rate. Wages
          must be paid{" "}
          <Text style={styles.important}>before the 7th of every month</Text> for
          monthly employees.
        </Text>

        <Text style={styles.sectionTitle}>2️⃣ Working Hours and Overtime</Text>
        <Text style={styles.text}>
          A worker cannot be made to work more than{" "}
          <Text style={styles.highlight}>8 hours a day</Text> or{" "}
          <Text style={styles.highlight}>48 hours a week</Text>. If overtime is
          required, it must be paid at{" "}
          <Text style={styles.important}>twice the normal rate</Text>.
        </Text>

        <Text style={styles.sectionTitle}>3️⃣ Weekly Off and Paid Leave</Text>
        <Text style={styles.text}>
          Every worker is entitled to{" "}
          <Text style={styles.highlight}>one paid weekly holiday</Text>. After
          completing 240 working days in a year, a worker earns{" "}
          <Text style={styles.important}>paid annual leave</Text>.
        </Text>

        <Text style={styles.sectionTitle}>4️⃣ Health, Safety & Working Conditions</Text>
        <Text style={styles.text}>
          Employers must ensure a{" "}
          <Text style={styles.highlight}>safe and hygienic workplace</Text> with
          clean drinking water, proper ventilation, and first-aid facilities.  
          Workers cannot be forced to work in{" "}
          <Text style={styles.important}>unsafe or unhealthy conditions</Text>.
        </Text>

        <Text style={styles.sectionTitle}>5️⃣ Equal Treatment and No Discrimination</Text>
        <Text style={styles.text}>
          Every worker is entitled to{" "}
          <Text style={styles.important}>equal pay for equal work</Text>.  
          Discrimination based on{" "}
          <Text style={styles.highlight}>gender, caste, or religion</Text> is
          strictly prohibited under Indian law.
        </Text>

        <Text style={styles.sectionTitle}>6️⃣ Protection from Unfair Dismissal</Text>
        <Text style={styles.text}>
          No worker can be terminated without{" "}
          <Text style={styles.highlight}>valid reason and due notice</Text>.  
          If dismissed, workers must receive proper{" "}
          <Text style={styles.important}>compensation or settlement</Text> according
          to the labour laws.
        </Text>

        <Text style={styles.sectionTitle}>7️⃣ Social Security Benefits</Text>
        <Text style={styles.text}>
          Eligible workers are entitled to{" "}
          <Text style={styles.important}>Provident Fund (PF)</Text>,{" "}
          <Text style={styles.important}>Employee State Insurance (ESI)</Text>, and
          other welfare benefits as per government norms.
        </Text>

        <Text style={styles.sectionTitle}>8️⃣ Right to Raise Complaints</Text>
        <Text style={styles.text}>
          If a worker faces harassment or exploitation, they can approach the{" "}
          <Text style={styles.highlight}>Labour Department of Madhya Pradesh</Text>  
          or raise a complaint under the{" "}
          <Text style={styles.bold}>Industrial Disputes Act</Text>.  
          Trade unions also help in ensuring fair treatment.
        </Text>

        <Text style={styles.note}>
          ⚖️ <Text style={styles.bold}>Note:</Text> These rights protect both permanent
          and contractual workers in Madhya Pradesh across all sectors.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
