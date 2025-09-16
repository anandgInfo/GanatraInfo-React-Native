import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CounterDetails = () => {
  const [counters, setCounters] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem("counters");
        if (saved) setCounters(JSON.parse(saved));
      } catch (e) {
        console.log("Failed to load counters:", e);
      }
    };
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const getTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(counters).length === 0 && <Text style={styles.noData}>No counters saved.</Text>}
      {Object.keys(counters).map((name) => {
        const data = counters[name];
        if (data.mode !== "countup") return null;

        const { days, hours, minutes, seconds } = getTime(data.timer);
        const index = Object.keys(counters).indexOf(name);
        const bgColor = index % 2 === 0 ? ["#FFB6B9", "#FFDEE9"] : ["#C7CEEA", "#E0E4FF"];

        return (
          <View key={name} style={[styles.card, { backgroundColor: bgColor[0] }]}>
            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar" size={28} color="#FF5252" style={{ marginRight: 5 }} />
              <Text style={styles.bigNumber}>{days} Days</Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#FF9800" style={{ marginRight: 5 }} />
              <Text style={styles.subText}>{hours}h</Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="timer-outline" size={22} color="#03A9F4" style={{ marginRight: 5 }} />
              <Text style={styles.subText}>{minutes}m</Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="timer-outline" size={22} color="#8BC34A" style={{ marginRight: 5 }} />
              <Text style={styles.subText}>{seconds}s</Text>
            </View>


            <View style={styles.row}>
              <MaterialCommunityIcons name="calendar-clock" size={18} color="#555" style={{ marginRight: 5 }} />
              <Text style={styles.date}>{formatDate(data.date)}</Text>
            </View>

            <View style={styles.row}>
              <MaterialCommunityIcons name="account-circle" size={22} color="#333" style={{ marginRight: 5 }} />
              <Text style={styles.name}>{name}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const cardWidth = Platform.OS === "web" ? 350 : 340;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#111827",
  },
  card: {
    width: cardWidth,
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  bigNumber: { fontSize: 28, fontWeight: "bold", color: "#111827" },
  subText: { fontSize: 18, color: "#555" },
  date: { fontSize: 14, color: "#555" },
  name: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  noData: { fontSize: 18, color: "#fff", textAlign: "center", marginTop: 50 },
});

export default CounterDetails;
