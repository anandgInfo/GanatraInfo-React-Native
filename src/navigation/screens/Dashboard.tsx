import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";

export const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Dashboard</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Balance</Text>
          <Text style={styles.cardValue}>₹1,25,720</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Saving</Text>
          <Text style={styles.cardValue}>₹20,000</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>➕ Add Money</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📈 View Growth</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>✅ ₹20,000 added (Sep 2025)</Text>
        <Text style={styles.activityText}>✅ Interest credited (Aug 2025)</Text>
        <Text style={styles.activityText}>✅ ₹2,000 yearly bonus added</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", 
    paddingVertical: 15,
    paddingHorizontal: Platform.OS === "web" ? 250 : 20,
  },
  header: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 5,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  cardTitle: { fontSize: 14, color: "#666" },
  cardValue: { fontSize: 20, fontWeight: "bold", marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 15 },
  actionButton: {
    flex: 1,
    backgroundColor: "#555",
    margin: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  activityCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  activityText: { fontSize: 14, marginVertical: 3 },
});
