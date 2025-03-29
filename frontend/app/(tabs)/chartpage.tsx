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
  const selectedCategory = "Grocery";  // Change this value manually in the code

  // Get best cards based on the selected spending category
  const topCreditCards = creditCardsByCategory[selectedCategory] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
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
    color: '#000000',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
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
