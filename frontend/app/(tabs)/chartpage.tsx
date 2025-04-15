import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { askOpenAI } from "./openaiHelper";

const cardImages: Record<string, any> = {
  "AMEX_GOLD": require("../../assets/cards/amex-gold.png"),
  "CSP": require("../../assets/cards/chase-sapphire-preferred.png"),
  "CAP1_SAVOR": require("../../assets/cards/capital-one-savor.png"),
};

const categories = ["Dining", "Travel", "Grocery"];

const ChartPage = () => {
  const [userId, setUserId] = useState("");
  const [userCards, setUserCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const [cardsRes, txRes] = await Promise.all([
        AsyncStorage.getItem("userCards"),
        fetch(`https://api-zto2acvx6a-uc.a.run.app/transactions?user_id=${userId}`),
      ]);
      const userCards = cardsRes ? JSON.parse(cardsRes) : [];
      const txJson = await txRes.json();

      setUserCards(userCards);
      setTransactions(txJson);

      const cardDetails = await Promise.all(userCards.map(async (card: any) => {
        const response = await fetch(`https://api-zto2acvx6a-uc.a.run.app/card_details?cardKey=${card.id}`);
        return response.ok ? await response.json() : null;
      }));

      const db = getDatabase();
      const prefRef = ref(db, `User_Transactions/${userId}/Preferences`);
      const prefSnapshot = await get(prefRef);
      const userPrefs = prefSnapshot.exists() ? prefSnapshot.val() : null;
      setPreferences(userPrefs);

      const prompt = `Here are the user's credit cards: ${JSON.stringify(cardDetails.filter(Boolean))}. Here are their recent transactions: ${JSON.stringify(txJson)}. Here are their preferences: ${JSON.stringify(userPrefs)}. Based on all this information, recommend the best card to use and explain why.`;

      const result = await askOpenAI(prompt);
      setLlmResult(result ?? "No recommendations available.");
    } catch (err) {
      console.error("Error during data loading or OpenAI call", err);
      Alert.alert("Error", "Failed to load data or get recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Best Card Recommendations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CD964" />
        ) : (
          <View>
            <Text style={styles.llmText}>{llmResult}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  scrollContent: { padding: 20, paddingTop: 50 },
  header: { fontSize: 34, fontWeight: "bold", marginBottom: 30, color: "#000" },
  llmText: { fontSize: 16, color: "#333", lineHeight: 22 },
});

export default ChartPage;