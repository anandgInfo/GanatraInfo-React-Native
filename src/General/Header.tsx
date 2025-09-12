import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Linking,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API_URL from "../config";
import AuthService from "../Services/AuthService";

interface HeaderProps {
  onMenuPress?: () => void;
}

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  const navigation: any = useNavigation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { width } = Dimensions.get("window");
  const isLargeScreen = width > 768;

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`${API_URL}/menus`);
        if (res.data?.length > 0) setMenuItems(res.data[0].items);
      } catch (err) {
        console.log("Menu fetch error:", err);
      }
    };
    fetchMenus();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (confirmed) {
        await AuthService.logout();
        navigation.replace("Login");
      }
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!isLargeScreen && (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        )}

        <Image
          source={require("@assets/image/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {isLargeScreen && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row", justifyContent: "flex-end", flex: 1 }}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ marginHorizontal: 10 }}
                onPress={() => {
                  if (!item.url || item.url === "#") return;

                  if (item.url.startsWith("http")) Linking.openURL(item.url);
                  else {
                    const route = item.url.startsWith("/") ? item.url.slice(1) : item.url;
                    navigation.navigate(route as never);
                  }
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16 }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Icon name="logout" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#353535" },
  container: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  logo: { height: 50, width: 140 },
  iconButton: { width: 50, alignItems: "center" },
});

export default Header;
