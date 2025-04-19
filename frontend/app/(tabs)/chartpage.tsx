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
  const [llmResult, setLlmResult] = useState<any | null>(null);
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

      // const prompt = `Here are the user's credit cards: ${JSON.stringify(cardDetails.filter(Boolean))}. Here are their recent transactions: ${JSON.stringify(txJson)}. Here are their preferences: ${JSON.stringify(userPrefs)}. Here is a list of all cards available in our database: ${JSON.stringify(allCards)}. Recommend one card that they do not yet have. Keep in mind user preferences and how they relate to the card details. Keep in mind that students may not want to pay a lot of annual fees. If they are a student, recommend cards that have low or 0 annual fees. Place emphasis on this. For the recommendation, include the card key in the format \"card_key:<key>\" at the beginning of the response. Additionally, include the name of the card, the annual fee, and a paragraph of reasoning. Respond in this order and do not include anything else. Respond in a user-friendly format, without any hashtags or markdown.`;
      const prompt = `
        You are helping choose a new credit card for a user. 

        Here are the user's credit cards: ${JSON.stringify(cardDetails.filter(Boolean))}.
        Here are their recent transactions: ${JSON.stringify(txJson)}.
        Here are their preferences: ${JSON.stringify(userPrefs)}.
        Here is a list of all cards available in our database: ${JSON.stringify(allCards)}.

        Recommend **one** card that they do **not** already have. Prioritize cards that match their preferences. 
        If they are a student, **strongly favor** cards with $0 or low annual fees.

        Respond ONLY with a JSON object formatted like this:
        {
          "card_key": "<card_key>",
          "name": "<Card Name>",
          "annual_fee": "<Annual Fee>",
          "reason": "<Short user-friendly paragraph explaining why this card is a good match>"
        }

        Do NOT include any markdown or extra commentary. Just return the JSON object.
        `;

      const result = await askOpenAI(prompt);

      try {
        const parsed = result ? JSON.parse(result) : null;
        setLlmResult(parsed);
      } catch (e) {
        console.error("Failed to parse OpenAI response as JSON:", e);
        setLlmResult(null);
      }

      // setLlmResult(result ?? "No recommendations available.");
    } catch (err) {
      console.error("Error during data loading or OpenAI call", err);
      Alert.alert("Error", "Failed to load data or get recommendation");
    } finally {
      setLoading(false);
    }
  };

  const extractCardKeys = (data: any): string[] => {
    if (!data || !data.card_key) return [];
    return [data.card_key];
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

  const renderLlmCardDetails = () => {
    if (!llmResult) return null;
  
    return (
      <View style={styles.recommendationBox}>
        <Text style={styles.cardName}>{llmResult.name}</Text>
        <Text style={styles.annualFee}>Annual Fee: {llmResult.annual_fee}</Text>
        <Text style={styles.reason}>{llmResult.reason}</Text>
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
            {renderLlmCardDetails()}
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
  recommendationBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  cardName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  annualFee: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  reason: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  
});

export default ChartPage;
