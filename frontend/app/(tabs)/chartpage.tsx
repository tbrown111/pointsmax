import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { askOpenAI } from "./openaiHelper";

const ChartPage = () => {
  const [userId, setUserId] = useState("");
  const [userCards, setUserCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardImages, setCardImages] = useState<any>({});

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
      const [txRes, allCardsRes, userCardsRes] = await Promise.all([
        fetch(`https://api-zto2acvx6a-uc.a.run.app/transactions?user_id=${userId}`),
        fetch("https://api-zto2acvx6a-uc.a.run.app/cards"),
        fetch(`https://api-zto2acvx6a-uc.a.run.app/user_cards?user_id=${userId}`),
      ]);

      const txJson = await txRes.json();
      const allCards = await allCardsRes.json();
      const userCardKeys = await userCardsRes.json();
      const userCards = userCardKeys.map((id: string) => ({ id }));

      setUserCards(userCards);
      setTransactions(txJson);
      setCardImages(allCards);

      const cardDetails = await Promise.all(userCards.map(async (card: any) => {
        const response = await fetch(`https://api-zto2acvx6a-uc.a.run.app/card_details?cardKey=${card.id}`);
        return response.ok ? await response.json() : null;
      }));

      const db = getDatabase();
      const prefRef = ref(db, `User_Transactions/${userId}/Preferences`);
      const prefSnapshot = await get(prefRef);
      const userPrefs = prefSnapshot.exists() ? prefSnapshot.val() : null;
      setPreferences(userPrefs);

      const prompt = `Here are the user's credit cards: ${JSON.stringify(cardDetails.filter(Boolean))}. Here are their recent transactions: ${JSON.stringify(txJson)}. Here are their preferences: ${JSON.stringify(userPrefs)}. Here is a list of all cards available in our database: ${JSON.stringify(allCards)}. Recommend one card from the user's current cards and one card they do not yet have, and explain why for both. For the recommendations, include the card key in the format \"card_key:<key>\" so we can identify the images. Respond in a user-friendly format, without any hashtags or markdown, and separate the two recommendations clearly.`;

      const result = await askOpenAI(prompt);
      setLlmResult(result ?? "No recommendations available.");
    } catch (err) {
      console.error("Error during data loading or OpenAI call", err);
      Alert.alert("Error", "Failed to load data or get recommendation");
    } finally {
      setLoading(false);
    }
  };

  const extractCardKeys = (text: string): string[] => {
    const matches = text.match(/card_key:([a-zA-Z0-9\-]+)/g);
    if (!matches) return [];
    return matches.map((match) => match.split(":")[1]);
  };

  const renderRecommendedImages = () => {
    if (!llmResult) return null;
    const keys = extractCardKeys(llmResult);
    return (
      <View style={styles.imageRow}>
        {keys.map((key) => (
          <View key={key} style={styles.imageBox}>
            <Image
              source={{ uri: cardImages[key]?.imageUrl || "https://via.placeholder.com/300x180?text=No+Image" }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>{cardImages[key]?.name || key}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Best Card Recommendations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CD964" />
        ) : (
          <View>
            {renderRecommendedImages()}
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
  llmText: { fontSize: 16, color: "#333", lineHeight: 22, marginTop: 20 },
  imageBox: { flex: 1, alignItems: "center", margin: 10 },
  imageRow: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" },
  cardImage: { width: 160, height: 100, borderRadius: 10 },
  cardLabel: { marginTop: 8, fontSize: 14, fontWeight: "600", textAlign: "center" },
});

export default ChartPage;
