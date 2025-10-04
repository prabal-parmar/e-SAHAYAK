import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../components/styles/employerHome'

type Shift = 'Shift 1' | 'Shift 2' | 'Overtime';

type Worker = {
  id: string;
  username: string;
  role: string;
  shift: Shift;
  clockIn: Date;
  leaving_time: string;
};

const mockEmployer = {
  username: "rajesh_k",
  organizationName: "SRAM - Ministry of Labour",
};
const { width: screenWidth } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: any) => (screenWidth / guidelineBaseWidth) * size;
const moderateScale = (size: any, factor = 0.5) => size + (scale(size) - size) * factor;

const ALL_WORKERS_DATA: Worker[] = [
  { id: '1', username: 'Prabal Parmar', role: 'Engineer', shift: 'Shift 1', clockIn: new Date(new Date().setHours(9, 1, 0)), leaving_time: 'pp' },
  { id: '2', username: 'Parth Gangrade', role: 'Logistics', shift: 'Shift 1', clockIn: new Date(new Date().setHours(9, 3, 0)), leaving_time: '' },
  { id: '3', username: 'Naveen Katara', role: 'Carpenter', shift: 'Shift 2', clockIn: new Date(new Date().setHours(17, 5, 0)), leaving_time: 'nk' },
  { id: '4', username: 'Sunita Devi', role: 'Quality Control', shift: 'Shift 1', clockIn: new Date(new Date().setHours(9, 8, 0)), leaving_time: '' },
  { id: '5', username: 'Amit Kumar', role: 'Logistics', shift: 'Overtime', clockIn: new Date(new Date().setHours(1, 15, 0)), leaving_time: 'ak' },
];


const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const formatDuration = (ms: number) => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  colors: string[];
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, colors }) => (
  <LinearGradient colors={colors} style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
  </LinearGradient>
);


export default function EmployerHomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedShifts, setExpandedShifts] = useState<{ [key: string]: boolean }>({
    'Shift 1': true,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredWorkers = useMemo(() => 
    ALL_WORKERS_DATA.filter(worker => 
      worker.username.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  const workersByShift = useMemo(() => 
    filteredWorkers.reduce((acc, worker) => {
      const shiftKey = worker.shift || 'Unassigned';
      if (!acc[shiftKey]) acc[shiftKey] = [];
      acc[shiftKey].push(worker);
      return acc;
    }, {} as { [key: string]: Worker[] }), [filteredWorkers]);

  const toggleShift = (shiftName: string) => {
    setExpandedShifts(prevState => ({ ...prevState, [shiftName]: !prevState[shiftName] }));
  };
  
  const shift1Count = ALL_WORKERS_DATA.filter(w => w.shift === 'Shift 1' && w.leaving_time).length;
  const shift2Count = ALL_WORKERS_DATA.filter(w => w.shift === 'Shift 2' && w.leaving_time).length;
  const overtimeCount = ALL_WORKERS_DATA.filter(w => w.shift === 'Overtime' && w.leaving_time).length;

  return (
    <SafeAreaView style={styles.safeArea}>
        <LinearGradient colors={['#FF8C00', '#FF6347']} style={styles.header}>
            <View style={styles.headerTopRow}>
                <View>
                    <Text style={styles.headerGreeting}>Welcome back,</Text>
                    <Text style={styles.headerName}>{mockEmployer.username}</Text>
                </View>
                <View style={styles.headerAvatarContainer}>
                    <Text style={styles.headerAvatarText}>{getInitials(mockEmployer.username)}</Text>
                </View>
            </View>
            <View style={styles.headerBottomRow}>
                <Text style={styles.headerDate}>{currentTime.toDateString()}</Text>
                <Text style={styles.headerTime}>{currentTime.toLocaleTimeString('en-IN')}</Text>
            </View>
        </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
            <StatCard icon={<MaterialIcons name="groups" size={moderateScale(24)} color="#fff" />} value={shift1Count} label="Shift 1" colors={['#3498DB', '#2980B9']} />
            <StatCard icon={<MaterialIcons name="groups" size={moderateScale(24)} color="#fff" />} value={shift2Count} label="Shift 2" colors={['#9B59B6', '#8E44AD']} />
            <StatCard icon={<MaterialIcons name="add-alarm" size={moderateScale(24)} color="#fff" />} value={overtimeCount} label="Overtime" colors={['#E67E22', '#D35400']} />
            <StatCard icon={<MaterialIcons name="engineering" size={moderateScale(24)} color="#fff" />} value={ALL_WORKERS_DATA.length} label="Total Workers" colors={['#1ABC9C', '#16A085']} />
        </ScrollView>

        <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Currently Working</Text>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={moderateScale(22)} color="#7A869A" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search worker..."
                    placeholderTextColor="#7A869A"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
        </View>
        
        {Object.keys(workersByShift).length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No working workers found.</Text>
          </View>
        ) : (
          Object.keys(workersByShift).map(shiftName => (
            <View key={shiftName} style={styles.shiftSection}>
              <TouchableOpacity style={styles.shiftHeader} onPress={() => toggleShift(shiftName)}>
                <View style={styles.shiftHeaderTitle}>
                  <Text style={styles.shiftName}>{shiftName}</Text>
                  <View style={styles.workerCountBadge}>
                    <Text style={styles.workerCountText}>{workersByShift[shiftName].length}</Text>
                  </View>
                </View>
                <MaterialIcons name={expandedShifts[shiftName] ? "expand-less" : "expand-more"} size={moderateScale(28)} color="#7A869A" />
              </TouchableOpacity>

              {expandedShifts[shiftName] && (
                <View style={styles.shiftContent}>
                  {workersByShift[shiftName].map((worker) => (
                    <View key={worker.id} style={styles.attendanceRow}>
                      {worker?.leaving_time ? (
                        <View style={styles.statusIndicatorGreen} />
                      ) : (
                        <View style={styles.statusIndicatorRed} />
                      )}
                      <View style={styles.workerInfo}>
                        <Text style={styles.workerName}>{worker.username}</Text>
                        <Text style={styles.workerDetail}>{worker.role}</Text>
                      </View>
                      <View style={styles.timeInfo}>
                        <Text style={styles.timeLabel}>Working Since</Text>
                        <Text style={styles.timeValue}>{formatDuration(currentTime.getTime() - worker.clockIn.getTime())}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
