import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get("window").width;

// Define available categories
const SPENDING_CATEGORIES = [
  "Restaurants",
  "Travel",
  "Groceries",
  "Retail"
];

// Update credit cards data structure
const creditCardsByCategory = {
  Restaurants: [
    { name: "Amex Gold", cashback: "4X points", image: require("../../assets/cards/amex-gold.png") },
    { name: "Chase Sapphire Preferred", cashback: "3X points", image: require("../../assets/cards/amex-gold.png") },
    { name: "Capital One Savor", cashback: "4% cash back", image: require("../../assets/cards/amex-gold.png") },
  ],
  Travel: [
    { name: "Chase Sapphire Reserve", cashback: "5X points", image: require("../../assets/cards/amex-gold.png") },
    { name: "Amex Platinum", cashback: "5X points", image: require("../../assets/cards/amex-gold.png") },
    { name: "Capital One Venture", cashback: "2X miles", image: require("../../assets/cards/amex-gold.png") },
  ],
  Groceries: [
    { name: "Amex Gold", cashback: "4X points", image: require("../../assets/cards/amex-gold.png") },
    { name: "Blue Cash Preferred", cashback: "6% cash back", image: require("../../assets/cards/amex-gold.png") },
    { name: "Capital One SavorOne", cashback: "3% cash back", image: require("../../assets/cards/amex-gold.png") },
  ],
  Retail: [
    { name: "Amazon Prime Visa", cashback: "5% cash back", image: require("../../assets/cards/amex-gold.png") },
    { name: "Target RedCard", cashback: "5% cash back", image: require("../../assets/cards/amex-gold.png") },
    { name: "Citi Double Cash", cashback: "2% cash back", image: require("../../assets/cards/amex-gold.png") },
  ],
};

const SpendingChartScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(SPENDING_CATEGORIES[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Best Credit Cards By Category</Text>

      {/* Category Picker */}
      <View style={styles.pickerContainer}>
        <Text>Select a category</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          {SPENDING_CATEGORIES.map((category) => (
            <Picker.Item 
              key={category} 
              label={category} 
              value={category} 
            />
          ))}
        </Picker>
      </View>

      {/* Credit Cards List */}
      <View style={styles.cardsContainer}>
        {creditCardsByCategory[selectedCategory]?.map((card, index) => (
          <View key={`card-${index}`} style={styles.cardRow}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  cardsContainer: {
    paddingTop: 200,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  imageContainer: {
    width: 160,
    marginRight: 15,
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cashbackText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SpendingChartScreen;
