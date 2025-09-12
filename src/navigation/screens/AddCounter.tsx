import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Dimensions } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Button } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddCounter = () => {
    const [mode, setMode] = useState<"countup" | "countdown">("countup");
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (mode === "countup") setTimer(prev => prev + 1);
            else setTimer(Math.max(0, Math.floor((date.getTime() - new Date().getTime()) / 1000)));
        }, 1000);
        return () => clearInterval(interval);
    }, [mode, date]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === "ios");
        if (selectedDate) setDate(selectedDate);
    };


    const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600).toString().padStart(2, "0");
        const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <MaterialCommunityIcons name="timer-outline" size={50} color="#007AFF" style={{ marginBottom: 10 }} />
                <Text style={styles.title}>Add New Counter</Text>

                <View style={styles.toggleContainer}>
                    <Button mode={mode === "countup" ? "contained" : "outlined"} onPress={() => setMode("countup")} style={[styles.toggleButton, mode === "countup" && styles.activeToggle]} >
                        Countup
                    </Button>
                    <Button mode={mode === "countdown" ? "contained" : "outlined"} onPress={() => setMode("countdown")} style={[styles.toggleButton, mode === "countdown" && styles.activeToggle]} >
                        Countdown
                    </Button>
                </View>

                <TextInput label="Enter Name" mode="outlined" value={name} onChangeText={setName} style={styles.input} />

                {mode === "countdown" && (
                    <View style={{ width: "100%" }}>
                        <Button mode="contained" onPress={() => setShowPicker(true)} style={styles.dateButton} >
                            Select Target Date & Time
                        </Button>

                        {showPicker && (
                            <DateTimePicker value={date} mode="datetime" display="default" onChange={handleDateChange} minimumDate={new Date()} />
                        )}
                    </View>
                )}

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{mode === "countup" ? "Counting Up" : "Countdown"}</Text>
                    <Text style={styles.timerValue}>{formatTime(timer)}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const screenWidth = Dimensions.get("window").width;
const cardWidth = Platform.OS === "ios" || Platform.OS === "android" ? 300 : Math.min(400, screenWidth - 40);
const toggleButtonWidth = (cardWidth - 50) / 2;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DEF7FF",
        paddingVertical: 50,
    },
    card: {
        width: cardWidth,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    toggleButton: {
        width: toggleButtonWidth,
        marginHorizontal: 5,
        borderRadius: 25,
    },
    activeToggle: {
        backgroundColor: "#007AFF",
    },
    input: {
        width: "100%",
        marginBottom: 20,
    },
    dateButton: {
        width: "100%",
        marginBottom: 20,
    },
    timerContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    timerText: {
        fontSize: 18,
        color: "#555",
    },
    timerValue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#007AFF",
        marginTop: 5,
    },
});

export default AddCounter;
