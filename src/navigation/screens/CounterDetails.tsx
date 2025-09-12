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
      } catch (e) { console.log("Failed to load counters:", e); }
    };
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.keys(counters).length === 0 && <Text style={styles.noData}>No counters saved.</Text>}
      {Object.keys(counters).map(name => {
        const data = counters[name];
        if (data.mode !== "countup") return null; // ✅ only countups
        const seconds = data.timer;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(seconds / 3600);

        return (
          <View key={name} style={styles.card}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.text}>Mode: {data.mode}</Text>
            <Text style={styles.text}>Seconds: {seconds}</Text>
            <Text style={styles.text}>Minutes: {minutes}</Text>
            <Text style={styles.text}>Hours: {hours}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const cardWidth = Platform.OS === "web" ? 400 : 300;
const styles = StyleSheet.create({
  container: { flexGrow:1, justifyContent:"center", alignItems:"center", backgroundColor:"#DEF7FF", paddingVertical:50 },
  card: { width:cardWidth, padding:20, borderRadius:20, backgroundColor:"#fff", alignItems:"center", marginBottom:20, shadowColor:"#000", shadowOpacity:0.1, shadowOffset:{width:0,height:5}, shadowRadius:10, elevation:5 },
  title: { fontSize:22, fontWeight:"bold", marginBottom:10, color:"#007AFF" },
  text: { fontSize:16, marginBottom:5 },
  noData: { fontSize:18, textAlign:"center", marginTop:50 },
});

export default CounterDetails;
