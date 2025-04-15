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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Placeholder image map for known card IDs
const cardImages: Record<string, any> = {
  "AMEX_GOLD": require("../../assets/cards/amex-gold.png"),
  "CSP": require("../../assets/cards/chase-sapphire-preferred.png"),
  "CAP1_SAVOR": require("../../assets/cards/capital-one-savor.png"),
  // Add more as needed
};

const categories = ["Dining", "Travel", "Grocery"];

const ChartPage = () => {
  const [userId, setUserId] = useState("");
  const [userCards, setUserCards] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({});
  const [bestValueByCategory, setBestValueByCategory] = useState<Record<string, number>>({});
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
      loadUserCards();
      fetchRecommendations();
    }
  }, [userId]);

  const loadUserCards = async () => {
    try {
      const saved = await AsyncStorage.getItem("userCards");
      const parsed = saved ? JSON.parse(saved) : [];
      const cardIds = parsed.map((c: any) => c.id); // assuming each has an `id`
      setUserCards(cardIds);
    } catch (err) {
      console.error("Error loading cards", err);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const recs: Record<string, string[]> = {};
      const valueMap: Record<string, number> = {};

      for (const cat of categories) {
        const response = await fetch(
          `https://api-zto2acvx6a-uc.a.run.app/optimal_card?user_id=${userId}&category=${cat}`
        );
        const data = await response.json();
        recs[cat] = data.best_card || [];
        valueMap[cat] = data.best_value || 0;
      }

      setRecommendations(recs);
      setBestValueByCategory(valueMap);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  const renderCard = (cardId: string, category: string) => {
    const userHasCard = userCards.includes(cardId);
    const img = cardImages[cardId] || null;
    return (
      <View key={cardId} style={styles.cardRow}>
        <View style={styles.imageContainer}>
          {img && <Image source={img} style={styles.cardImage} resizeMode="contain" />}
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>{cardId}</Text>
          <Text style={styles.cashbackText}>
            {userHasCard ? "✅ You have this card" : "❌ You don’t have this card"}
          </Text>
          {!userHasCard && (
            <Text style={styles.recommendText}>
              Consider getting this for {category} — it earns {bestValueByCategory[category]}x back.
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Best Cards</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CD964" />
        ) : (
          categories.map((category) => (
            <View key={category} style={{ marginBottom: 30 }}>
              <Text style={styles.subHeader}>Top picks for {category}</Text>
              {(recommendations[category] || []).map((cardId) => renderCard(cardId, category))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  scrollContent: { padding: 20, paddingTop: 50 },
  header: { fontSize: 34, fontWeight: "bold", marginBottom: 30, color: "#000" },
  subHeader: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
  },
  imageContainer: { width: 120, marginRight: 15 },
  cardImage: { width: "100%", height: 80 },
  cardDetails: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  cashbackText: { fontSize: 14, color: "#666" },
  recommendText: { fontSize: 13, color: "#444", marginTop: 5 },
});

export default ChartPage;