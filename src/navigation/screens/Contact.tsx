import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ContactForm = () => {
  const { width } = useWindowDimensions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email";
    if (!message.trim()) newErrors.message = "Please enter your message";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    Alert.alert("✅ Success", `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
  };

  const formWidth = width > 600 ? 500 : width * 0.9;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.formContainer, { width: formWidth }]}>
          <Text style={styles.title}>
            <Icon name="contacts" size={30} color="#2563eb" /> Contact Us
          </Text>

          {/* Name Field */}
          <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
            <Icon name="account-outline" size={22} color="#6b7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors({ ...errors, name: undefined });
              }}
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Email Field */}
          <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
            <Icon name="email-outline" size={22} color="#6b7280" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Message Field */}
          <View style={[styles.inputWrapperTextArea, errors.message && styles.inputError]}>
            <Icon name="message-text-outline" size={22} color="#6b7280" style={styles.icon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your message"
              value={message}
              onChangeText={(text) => {
                setMessage(text);
                setErrors({ ...errors, message: undefined });
              }}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#f3f4f6",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#111827",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  inputWrapperTextArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  inputError: {
    borderColor: "red",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    paddingLeft: 5,
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: "#111827",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default ContactForm;
