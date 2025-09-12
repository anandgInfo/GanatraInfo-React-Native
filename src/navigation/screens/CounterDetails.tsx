import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const interval = setInterval(loadData, 1000); // update every second
    return () => clearInterval(interval);
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Convert seconds to days, hours, minutes, seconds
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
            <Text style={styles.bigNumber}>{days} Days</Text>
            <Text style={styles.subText}>{hours}h {minutes}m {seconds}s</Text>
            <Text style={styles.date}>{formatDate(data.date)}</Text>
            <Text style={styles.name}>{name}</Text>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  bigNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#111827",
  },
  subText: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 14,
    color: "#555",
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 5,
  },
  noData: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
});

export default CounterDetails;
