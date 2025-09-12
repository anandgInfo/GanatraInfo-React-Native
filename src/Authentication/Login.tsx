import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Alert, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API_URL from "../config";
import AuthService from "../Services/AuthService";

const { width } = Dimensions.get("window");

export const Login = () => {
  const navigation: any = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const isLogged = await AuthService.isLoggedIn();
      if (isLogged) {
        navigation.replace("Dashboard");
      } else {
        setCheckingAuth(false);
      }
    };
    checkLogin();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Missing Fields", "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;

      if (token) {
        await AuthService.login(token, user);
        navigation.replace("Dashboard");
      } else {
        Alert.alert("⚠️ Invalid Credentials", "Please check email & password.");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong, try again.";
      Alert.alert("Error ⚠️", message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.outerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Image source={require("@assets/image/logo-dark.png")} style={styles.logo} resizeMode="contain" />

        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} left={<TextInput.Icon icon="email" />} />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
        />

        <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: 16 },
  card: { width: width > 500 ? 400 : "90%", backgroundColor: "white", borderRadius: 12, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6 },
  logo: { height: 60, alignSelf: "center", marginBottom: 10 },
  input: { marginBottom: 10, backgroundColor: "white" },
  button: { marginTop: 10, borderRadius: 8, backgroundColor: "#555" },
});
