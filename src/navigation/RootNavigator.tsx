import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Linking, Platform } from "react-native";
import axios from "axios";

import Header from "../General/Header";
import { Dashboard } from "./screens/Dashboard";
import { Login } from "src/Authentication/Login";
import { NotFound } from "./screens/NotFound";
import API_URL from "../config";
import { About } from "./screens/About";
import Services from "./screens/Services";
import AddCounter from "./screens/AddCounter";
import CounterDetails from "./screens/CounterDetails";

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  NotFound: undefined;
  [key: string]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

interface MenuItem {
  id: number;
  label: string;
  url: string;
}

function HomeDrawer() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const screenMap: { [key: string]: React.ComponentType<any> } = {
    Dashboard: Dashboard,
    Login: Login,
    NotFound: NotFound,
    About: About,
    Services: Services,
    Counter: AddCounter,
    Time: CounterDetails,
  };

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

  return (
    <Drawer.Navigator
      screenOptions={{
        header: (props) => <Header onMenuPress={props.navigation.toggleDrawer} />,
        drawerStyle: { backgroundColor: "#353535" },
        drawerActiveTintColor: "#FF6347",
        drawerInactiveTintColor: "#fff",
        drawerLabelStyle: { fontSize: 16 },
        drawerItemStyle: { marginVertical: 2.5 },
      }} >
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ title: "Dashboard" }} />
      {menuItems.map((item) => {
        // IF url is "#" than not show in frontend side 
        if (item.url === "#") return null;
        if (item.url.startsWith("http")) {
          const ExternalLinkScreen = () => {
            if (Platform.OS === "web") {
              window.open(item.url, "_blank");
            } else {
              Linking.openURL(item.url);
            }
            return null;
          };

          return (
            <Drawer.Screen
              key={item.id}
              name={item.label}
              component={ExternalLinkScreen}
              options={{ title: item.label }}
            />
          );
        }
        const ScreenComponent = screenMap[item.url] || Dashboard;

        return (
          <Drawer.Screen key={item.id} name={item.url} component={ScreenComponent} options={{ title: item.label }} />
        );
      })}
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Dashboard" component={HomeDrawer} />
      <Stack.Screen name="NotFound" component={NotFound} />
    </Stack.Navigator>
  );
}
