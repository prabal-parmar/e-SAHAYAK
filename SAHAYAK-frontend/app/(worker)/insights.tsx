import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import {styles} from '../../components/styles/insights'
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useWorker } from '@/context/WorkerContext';
import { getHeaderStats, getWorkHistory } from '@/api/Worker/insight_routes';

type SatisfactionStatus = 'satisfied' | 'report' | 'pending';

type WorkEntry = {
  id: string;
  organizationName: string;
  date: Date;
  wages: number;
  satisfaction: SatisfactionStatus;
};

type WEEK = {
  week: string;
  earnings: number;
}

interface WORKERSTATS {
  monthlyAnalysis: WEEK[];
  pastWork: WorkEntry[];
}

const { width: screenWidth } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;


const AnimatedBar = ({ value, maxValue, label }: { value: number, maxValue: number, label: string }) => {
    const heightAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: (value / maxValue) * 100,
            duration: 600,
            delay: Math.random() * 250,
            useNativeDriver: false,
        }).start();
    }, [value, maxValue]);

    return (
        <View style={styles.barWrapper}>
            <Animated.View style={[styles.bar, { height: heightAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%']}) }]} />
            <Text style={styles.barLabel}>{label}</Text>
        </View>
    );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <View style={styles.statTextContainer}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const SatisfactionBadge = ({ status }: { status: SatisfactionStatus }) => {
    const config = {
        satisfied: { icon: 'thumb-up', color: '#27AE60', text: 'Satisfied' },
        'report': { icon: 'thumb-down', color: '#E74C3C', text: 'Not Satisfied' },
        pending: { icon: 'hourglass-empty', color: '#F39C12', text: 'Pending' },
    }[status];

    return (
        <View style={[styles.satisfactionBadge, { backgroundColor: `${config.color}20` }]}>
            <MaterialIcons name={config.icon as any} size={moderateScale(12)} color={config.color} />
            <Text style={[styles.satisfactionText, { color: config.color }]}>{config.text}</Text>
        </View>
    );
};

export default function WorkerAnalysisPage() {
  const maxEarning = 1000;
  const {worker} = useWorker()
  const [totalEarning, setTotalEarning] = useState<number>(0)
  const [leaves, setLeaves] = useState<Number>(0);
  const [present, setPresent] = useState<Number>(0);
  const [workerData, setWorkerData] = useState<WORKERSTATS | null>()
  useEffect(() => {
    const fetchHeaderData = async () => {
      const data = await getHeaderStats();
      const history = await getWorkHistory();
      if(!data){
        return null;
      }
      const workHistory = {
        monthlyAnalysis: data.data.monthlyAnalysis,
        pastWork: history.data
      }
      setWorkerData(workHistory)
      setTotalEarning(data ? data.data.this_month_salary: 0)
      setLeaves(data ? data.data.leave_days: 0)
      setPresent(data ? data.data && data.data.working_days: 0)
    }
    fetchHeaderData()
  }, [])

  return (
      <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <LinearGradient
          colors={["#FDC830", "#2C1810"]}
          style={styles.headerGradient}
        >
          <Text style={styles.headerGreeting}>Hello, {`${worker?.firstName} ${worker?.lastName}`}</Text>
          <Text style={styles.headerTitle}>Your Work Analysis</Text>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          <View style={styles.statsRow}>
            <StatCard icon={<MaterialIcons name="account-balance-wallet" size={moderateScale(24)} color="#27AE60" />} value={`₹${Math.round(totalEarning)}`} label="This Month" />
            <StatCard icon={<MaterialIcons name="check-circle" size={moderateScale(24)} color="#2980B9" />} value={`${present}`} label="Days Present" />
            <StatCard icon={<MaterialIcons name="cancel" size={moderateScale(24)} color="#C0392B" />} value={`${leaves}`} label="Leaves Taken" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>This Month's Earnings</Text>
            <View style={styles.chartContainer}>
              {workerData && workerData.monthlyAnalysis.map((data, index) => (
                <AnimatedBar key={index} value={data.earnings} maxValue={maxEarning} label={data.week} />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Work History</Text>

            {workerData && workerData.pastWork.length > 0 ? workerData.pastWork.map((work) => (
              <View key={work.id} style={styles.workRow}>
                <View style={[styles.workIconContainer]}>
                    <MaterialIcons name={"work"} size={moderateScale(22)} color={'#34495E'} />
                </View>
                <View style={styles.workDetails}>
                  <Text style={styles.workOrg}>{work.organizationName}</Text>
                  <Text style={styles.workDate}>
                    {new Date(work.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
            }
                  </Text>
                  <SatisfactionBadge status={work.satisfaction} />
                </View>
                <View style={styles.wageInfo}>
                  <Text style={styles.wageValue}>₹{work.wages}</Text>
                  <Text style={styles.wageLabel}>To be Received</Text>
                </View>
              </View>
            )) : (
              <Text style={styles.noHistoryText}>No work history found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
