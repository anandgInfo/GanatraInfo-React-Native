import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Text } from "react-native";
import axios from "axios";
import API_URL from "../config";
import { Login } from "../Authentication/Login";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Dashboard } from "@navigation/screens/Dashboard";

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

const Drawer = createDrawerNavigator();

export const DashboardDrawer = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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

  const CustomDrawerContent = (props: any) => {
    const navigation = useNavigation();

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: "#353535" }}>
        {menuItems.map((item) => (
          <DrawerItem
            key={item.id}
            label={() => <Text style={{ color: "#fff" }}>{item.label}</Text>}
            onPress={() => {
              if (!item.url || item.url === "#") return;

              if (item.url.startsWith("http")) {
                Linking.openURL(item.url);
              } else {
                const route = item.url.startsWith("/") ? item.url.slice(1) : item.url;
                navigation.navigate(route as never);
              }
            }}
          />
        ))}
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
};
