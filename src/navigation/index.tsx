import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStaticNavigation, StaticParamList } from "@react-navigation/native";
import { NotFound } from "./screens/NotFound";
import { Dashboard } from "./screens/Dashboard";
import { Login } from "../Authentication/Login";
import Header from "src/General/Header";

const RootStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        title: "Login",
        headerShown: false,
      },
    },
    Dashboard: {
      screen: Dashboard,
      options: {
        header: () => (
          <Header/>

        ),
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
