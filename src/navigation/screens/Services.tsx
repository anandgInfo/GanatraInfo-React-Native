// Services.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const servicesData: Service[] = [
  { id: "1", title: "Web Development", description: "Responsive websites and web apps", icon: "web" },
  { id: "2", title: "Mobile App Development", description: "iOS & Android apps", icon: "phone-android" },
  { id: "3", title: "UI/UX Design", description: "Beautiful and user-friendly designs", icon: "design-services" },
  { id: "4", title: "SEO Services", description: "Improve your website ranking", icon: "trending-up" },
];

const Services: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Our Services</Text>
      {servicesData.map((service) => (
        <View key={service.id} style={styles.card}>
          <MaterialIcons name={service.icon} size={40} color="#4A90E2" />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{service.title}</Text>
            <Text style={styles.description}>{service.description}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
});

export default Services;
