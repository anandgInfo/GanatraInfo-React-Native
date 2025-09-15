import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddCounter = () => {
    const [mode, setMode] = useState<"countup" | "countdown">("countup");
    const [name, setName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            if (mode === "countup") {
                setTimer(prev => prev + 1);
            } else {
                setTimer(Math.max(0, Math.floor((date.getTime() - new Date().getTime()) / 1000)));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, mode, date]);

    const loadCounter = async (counterName: string) => {
        if (!counterName.trim()) return;
        try {
            const allData = await AsyncStorage.getItem("counters");
            if (allData) {
                const parsed = JSON.parse(allData);
                if (parsed[counterName]) {
                    const counter = parsed[counterName];
                    setMode(counter.mode);
                    setDate(new Date(counter.date));
                    setTimer(counter.timer ?? 0);
                    setIsRunning(false);
                } else {
                    setTimer(0);
                    setDate(new Date());
                    setIsRunning(false);
                }
            }
        } catch (e) {
            console.log("Failed to load counter:", e);
        }
    };


    const saveCounter = async () => {
        if (!name.trim()) return;
        try {
            const allDataStr = await AsyncStorage.getItem("counters");
            const allData = allDataStr ? JSON.parse(allDataStr) : {};
            allData[name] = { name, mode, date: date.toISOString(), timer, isRunning };
            await AsyncStorage.setItem("counters", JSON.stringify(allData));
        } catch (e) {
            console.log("Failed to save counter:", e);
        }
    };

    const handleStartPause = async () => {
        if (!name.trim()) return alert("Enter a name!");
        const allDataStr = await AsyncStorage.getItem("counters");
        const allData = allDataStr ? JSON.parse(allDataStr) : {};
        let existingTimer = 0;
        if (allData[name]) {
            existingTimer = allData[name].timer ?? 0;
        }

        if (!isRunning) {
            setTimer(prev => prev + existingTimer);
            setIsRunning(true);
        } else {
            setIsRunning(false);
            await saveCounter();
        }
    };

    const handleReset = async () => {
        if (!name.trim()) return alert("Enter a name!");
        setTimer(0);
        setDate(new Date());
        setIsRunning(false);
        await saveCounter();
    };

    const handleNameChange = (newName: string) => {
        setName(newName);
        loadCounter(newName);
    };

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

                <TextInput
                    label="Enter Name"
                    mode="outlined"
                    value={name}
                    onChangeText={handleNameChange}
                    style={styles.input}
                />

                <View style={styles.toggleContainer}>
                    <Button mode={mode === "countup" ? "contained" : "outlined"} onPress={() => setMode("countup")} style={[styles.toggleButton, mode === "countup" && styles.activeToggle]}>Countup</Button>
                    <Button mode={mode === "countdown" ? "contained" : "outlined"} onPress={() => setMode("countdown")} style={[styles.toggleButton, mode === "countdown" && styles.activeToggle]}>Countdown</Button>
                </View>

                {mode === "countdown" && (
                    <View style={{ width: "100%" }}>
                        {Platform.OS === "web" ? (
                            <input type="datetime-local" value={date.toISOString().slice(0, 16)} onChange={(e) => setDate(new Date(e.target.value))} style={{ width: "93%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }} />
                        ) : (
                            <>
                                {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()} />}
                                <Button mode="contained" onPress={() => setShowPicker(true)} style={styles.dateButton}>Select Date & Time</Button>
                            </>
                        )}
                    </View>
                )}

                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{mode === "countup" ? "Counting Up" : "Countdown"}</Text>
                    <Text style={styles.timerValue}>{formatTime(timer)}</Text>
                </View>

                <View style={styles.actionButtons}>
                    <Button mode="contained" onPress={handleStartPause} style={styles.startButton}>{isRunning ? "Pause" : "Start"}</Button>
                    <Button mode="outlined" onPress={handleReset} style={styles.resetButton}>Reset</Button>
                </View>
            </View>
        </ScrollView>
    );
};

const cardWidth = Platform.OS === "web" ? 400 : 300;
const toggleButtonWidth = (cardWidth - 50) / 2;
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DEF7FF", paddingVertical: 50 },
    card: { width: cardWidth, padding: 20, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "#333", textAlign: "center" },
    input: { width: "100%", marginBottom: 20 },
    toggleContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    toggleButton: { width: toggleButtonWidth, marginHorizontal: 5, borderRadius: 25 },
    activeToggle: { backgroundColor: "#007AFF" },
    dateButton: { width: "100%", marginBottom: 20 },
    timerContainer: { alignItems: "center", marginTop: 20, marginBottom: 20 },
    timerText: { fontSize: 18, color: "#555" },
    timerValue: { fontSize: 28, fontWeight: "bold", color: "#007AFF", marginTop: 5 },
    actionButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    startButton: { flex: 1, marginRight: 10, borderRadius: 25 },
    resetButton: { flex: 1, borderRadius: 25 },
});

export default AddCounter;
