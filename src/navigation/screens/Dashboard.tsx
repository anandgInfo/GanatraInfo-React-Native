import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";

export const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>✨ Welcome to Your Dashboard</Text>

      <Text style={styles.sectionTitle}>Quick Info</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather</Text>
          <Text style={styles.cardValue}>Sunny, 32°C</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Messages</Text>
          <Text style={styles.cardValue}>5 unread</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tasks</Text>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>Finish React Native Module</Text>
        <Text style={styles.taskDue}>Due: Sep 20, 2025</Text>
      </View>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>Prepare Presentation Slides</Text>
        <Text style={styles.taskDue}>Due: Sep 18, 2025</Text>
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>🔔 Your profile was updated successfully</Text>
      </View>
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>🔔 New comment on your post</Text>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📩 New Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>📅 Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingVertical: 15,
    paddingHorizontal: Platform.OS === "web" ? 250 : 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
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
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  taskCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDue: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  notificationCard: {
    backgroundColor: "#e1f5fe",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  notificationText: { fontSize: 14 },
  actionButton: { flex: 1, backgroundColor: "#0277bd", margin: 5, padding: 12, borderRadius: 8, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold" },
});
