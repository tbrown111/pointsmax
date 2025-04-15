<<<<<<< HEAD
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";

// Images (update with your actual images)
const amexGoldImage = require("../../assets/cards/amex-gold.png");
const chaseSapphirePreferredImage = require("../../assets/cards/chase-sapphire-preferred.png");
const capitalOneSavorImage = require("../../assets/cards/capital-one-savor.png");

// Credit cards by spending category
const creditCardsByCategory = {
  Grocery: [
    { name: "Amex Gold", cashback: "4X points", image: amexGoldImage },
    {
      name: "Chase Sapphire Preferred",
      cashback: "3X points",
      image: chaseSapphirePreferredImage,
    },
    {
      name: "Capital One Savor",
      cashback: "4% cash back",
      image: capitalOneSavorImage,
    },
  ],
  Travel: [
    { name: "PenFed Platinum", cashback: "5% cash back", image: amexGoldImage },
    {
      name: "Citi Custom Cash",
      cashback: "5% cash back",
      image: amexGoldImage,
    },
    {
      name: "Blue Cash Preferred",
      cashback: "3% cash back",
      image: amexGoldImage,
    },
  ],
  Leisure: [
    {
      name: "Amazon Prime Visa",
      cashback: "5% cash back",
      image: amexGoldImage,
    },
    {
      name: "Chase Freedom Unlimited",
      cashback: "1.5% cash back",
      image: amexGoldImage,
    },
    { name: "Amex Platinum", cashback: "1X points", image: amexGoldImage },
  ],
};

const SpendingChartScreen = () => {
  // Manually set the category to "Grocery", "Travel", or "Leisure"
  const selectedCategory = "Grocery"; // Change this value manually in the code

  // Get best cards based on the selected spending category
  const topCreditCards = creditCardsByCategory[selectedCategory] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Best Cards</Text>

        {/* Render best credit cards for the selected category */}
        <Text style={styles.subHeader}>
          Best Cards for{" "}
          <Text style={styles.categoryHighlight}>{selectedCategory}</Text>{" "}
          Spending:
        </Text>
        <View style={styles.cardsContainer}>
          {topCreditCards.map((card, index) => (
            <View key={index} style={styles.cardRow}>
              <View style={styles.imageContainer}>
                <Image
                  source={card.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cashbackText}>{card.cashback}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
    color: "#000000",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "left",
  },
  categoryHighlight: {
    fontStyle: "italic",
    color: "#4CD964",
  },
  cardsContainer: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    width: 160,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cashbackText: {
    fontSize: 14,
    color: "#666",
  },
});

export default SpendingChartScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";

// // Images (update with your actual images)
// const amexGoldImage = require("../../assets/cards/amex-gold.png");
// const chaseSapphirePreferredImage = require("../../assets/cards/chase-sapphire-preferred.png");
// const capitalOneSavorImage = require("../../assets/cards/capital-one-savor.png");

// // Credit cards by spending category
// const creditCardsByCategory = {
//   Grocery: [
//     { name: "Amex Gold", cashback: "4X points", image: amexGoldImage },
//     {
//       name: "Chase Sapphire Preferred",
//       cashback: "3X points",
//       image: chaseSapphirePreferredImage,
//     },
//     {
//       name: "Capital One Savor",
//       cashback: "4% cash back",
//       image: capitalOneSavorImage,
//     },
//   ],
// };

// const SpendingChartScreen = () => {
//   const selectedCategory = "Grocery";
//   const topCreditCards = creditCardsByCategory[selectedCategory] || [];
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePreviousCard = () => {
//     setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
//   };

//   const handleNextCard = () => {
//     setCurrentIndex((prevIndex) => (prevIndex < topCreditCards.length - 1 ? prevIndex + 1 : prevIndex));
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
//         <Text style={styles.header}>Best Cards</Text>

//         <Text style={styles.subHeader}>
//           Best Cards for <Text style={styles.categoryHighlight}>{selectedCategory}</Text> Spending:
//         </Text>

//         {topCreditCards.length > 0 && (
//           <View style={styles.cardRow}>
//             <TouchableOpacity style={styles.arrowButton} onPress={handlePreviousCard} disabled={currentIndex === 0}>
//               <Text style={styles.arrowText}>←</Text>
//             </TouchableOpacity>

//             <View style={styles.cardContainer}>
//               <Image source={topCreditCards[currentIndex].image} style={styles.cardImage} resizeMode="contain" />
//               <Text style={styles.cardName}>{topCreditCards[currentIndex].name}</Text>
//               <Text style={styles.cashbackText}>{topCreditCards[currentIndex].cashback}</Text>
//             </View>

//             <TouchableOpacity style={styles.arrowButton} onPress={handleNextCard} disabled={currentIndex === topCreditCards.length - 1}>
//               <Text style={styles.arrowText}>→</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f5f7fa",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingTop: 50,
//   },
//   header: {
//     fontSize: 34,
//     fontWeight: "bold",
//     textAlign: "left",
//     marginBottom: 30,
//     color: "#000000",
//   },
//   subHeader: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginVertical: 20,
//     textAlign: "left",
//   },
//   categoryHighlight: {
//     fontStyle: "italic",
//     color: "#4CD964",
//   },
//   cardRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginVertical: 20,
//   },
//   cardContainer: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   cardImage: {
//     width: 225,
//     height: 150,
//     marginBottom: 10,
//     resizeMode: "contain"
//   },
//   cardName: {
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   cashbackText: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//   },
//   arrowButton: {
//     padding: 10,
//     backgroundColor: "#4CD964",
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   arrowText: {
//     fontSize: 24,
//     color: "#fff",
//   },
// });

// export default SpendingChartScreen;
=======
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
>>>>>>> 18b601e (starting to integrate openai)
