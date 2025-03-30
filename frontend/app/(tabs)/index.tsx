// frontend/app/index.tsx
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // or use 'react-native-linear-gradient'
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from 'expo-image';

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // States for your spending form:
  const [spendingCategory, setSpendingCategory] = useState("");
  const [spendingAmount, setSpendingAmount] = useState("");
  const [spendingNote, setSpendingNote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Checking Auth...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const spendingData = {
      category: spendingCategory,
      amount: spendingAmount,
      note: spendingNote,
      date: new Date().toISOString(),
    };
    console.log("Submitted Spending:", spendingData);
    // Reset inputs if desired:
    setSpendingCategory("");
    setSpendingAmount("");
    setSpendingNote("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Text style={styles.header}>Home</Text>
        <View style={styles.homeContent}>
        
        <Text style={styles.title}>
          <Text style={{ color: 'black' }}>Welcome to </Text>
          <Text style={{ color: '#4CD964', fontStyle: 'italic' }}>PointsMax</Text>
        </Text>
        {/* Content Cards */}
        <View style={styles.content}>
        <Image 
            source={require('../../assets/images/cc.gif')} // Path to your GIF
            style={styles.gif} 
            contentFit="contain"
          />
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/track")}
          >
            <Text style={styles.cardTitle}>Track Your Spending</Text>
            <Text style={styles.cardDescription}>
              Monitor your expenses and gain insights to optimize your spending
              habits.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/chartpage")}
          >
            <Text style={styles.cardTitle}>Find Best Credit Cards</Text>
            <Text style={styles.cardDescription}>
              Discover credit card options tailored to your lifestyle and
              spending patterns.
            </Text>
          </TouchableOpacity>
          
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 0,
    color: '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    textAlign: 'center',
    paddingBottom: 20
  },
  content: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    width: width - 40,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FD3A69",
  },
  homeContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30
  },
  gif: {
    width: 300,  // Adjust width
    height: 200, // Adjust height
    marginBottom: 20
  },
});
