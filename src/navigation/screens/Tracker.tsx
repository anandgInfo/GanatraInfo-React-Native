import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Platform, StyleSheet, Button, Dimensions, Image, TextInput } from "react-native";
import { captureRef } from "react-native-view-shot";

interface TrackerEntry {
    timestamp: number;
    screenshot: string;
    keysPressed: string[];
}

const Tracker = () => {
    const [keysPressed, setKeysPressed] = useState<string[]>([]);
    const [trackerLog, setTrackerLog] = useState<TrackerEntry[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [startCount, setStartCount] = useState(0);
    const [stopCount, setStopCount] = useState(0);
    const intervalRef = useRef<any>(null);

    const appRef = useRef<any>(null);
    const inputRef = useRef<any>(null);

    useEffect(() => {
        if (Platform.OS === "web") {
            const handleKeyDown = (event: KeyboardEvent) => {
                setKeysPressed((prev) => [...prev, event.key]);
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, []);

    const handleInputKey = (key: string) => {
        setKeysPressed((prev) => [...prev, key]);
    };

    const startTracking = () => {
        if (isTracking) return;
        setIsTracking(true);
        setStartCount((prev) => prev + 1);

        intervalRef.current = setInterval(async () => {
            let screenshot = "";
            try {
                if (Platform.OS === "web") {
                    const html2canvas = (await import("html2canvas")).default;
                    if (appRef.current) {
                        const canvas = await html2canvas(appRef.current); screenshot = canvas.toDataURL("image/png");
                    }
                } else if (appRef.current) {
                    screenshot = await captureRef(appRef.current, {
                        format: "png", quality: 0.8, result: "base64",
                    });
                    screenshot = `data:image/png;base64,${screenshot}`;
                }
            } catch (error) {
                console.error("Screenshot error:", error);
            }

            setTrackerLog((prev) => [...prev, { timestamp: Date.now(), screenshot, keysPressed }]);
            setKeysPressed([]);
        }, 10000);
    };

    const stopTracking = () => {
        if (!isTracking) return;
        setIsTracking(false);
        setStopCount((prev) => prev + 1);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const screenWidth = Dimensions.get("window").width;
    const cardWidth = Platform.OS === "web" ? 400 : screenWidth - 40;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View ref={appRef} style={[styles.appContainer, { width: cardWidth }]}>
                <Text style={styles.title}>Tracker App</Text>

                <View style={styles.buttonContainer}>
                    <Button title="Start" onPress={startTracking} disabled={isTracking} />
                    <Button title="Stop" onPress={stopTracking} disabled={!isTracking} />
                </View>

                <Text style={styles.counterText}>
                    Started: {startCount} times | Stopped: {stopCount} times
                </Text>

                {Platform.OS !== "web" && (
                    <TextInput ref={inputRef} style={styles.input} placeholder="Type something to track keys..." onKeyPress={({ nativeEvent }) => handleInputKey(nativeEvent.key)} />
                )}

                <ScrollView style={styles.logsContainer}>
                    {trackerLog.map((entry, idx) => (
                        <View key={idx} style={styles.logItem}>
                            <Text>Time: {new Date(entry.timestamp).toLocaleTimeString()}</Text>
                            <Text>Keys Pressed: {entry.keysPressed.join(", ") || "None"}</Text>
                            {entry.screenshot && (
                                Platform.OS === "web" ? (
                                    <img src={entry.screenshot} alt="Screenshot" style={{ width: 150, height: 100, marginTop: 5 }} />
                                ) : (
                                    <Image source={{ uri: entry.screenshot }} style={{ width: 150, height: 100, marginTop: 5 }} />
                                )
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#DEF7FF",
        alignItems: "center",
        minHeight: "100%",
    },
    appContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginBottom: 10,
    },
    counterText: {
        marginBottom: 20,
        fontSize: 16,
        fontWeight: "bold"
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    logsContainer: {
        width: "100%",
        maxHeight: 300
    },
    logItem: {
        width: "100%",
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
    },
});

export default Tracker;