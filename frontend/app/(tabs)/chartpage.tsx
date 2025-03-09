import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const screenWidth = Dimensions.get("window").width;

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
  const [selectedCategory, setSelectedCategory] = useState("Grocery");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Grocery", value: "Grocery" },
    { label: "Travel", value: "Travel" },
    { label: "Leisure", value: "Leisure" },
  ]);

  // Get best cards based on the selected spending category
  const topCreditCards = creditCardsByCategory[selectedCategory] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text style={styles.header}>Spending Categories</Text>

          {/* Dropdown for spending categories */}
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={open}
              value={selectedCategory}
              items={items}
              setOpen={setOpen}
              setValue={setSelectedCategory}
              setItems={setItems}
              containerStyle={{ width: screenWidth - 40 }}
              style={styles.dropdown}
              dropDownStyle={styles.dropdownList}
              labelStyle={styles.dropdownLabel}
            />
          </View>

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fa",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 10,
    textAlign: "center",
  },
  dropdownContainer: {
    marginVertical: 10,
    zIndex: 1000, // ensures the dropdown displays above other elements
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  dropdownList: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
  },
  dropdownLabel: {
    fontSize: 16,
    color: "#333",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "center",
  },
  categoryHighlight: {
    fontStyle: "italic",
    color: "#FF6384",
  },
  cardsContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  cardRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    width: 120,
    marginRight: 15,
  },
  cardImage: {
    width: "100%",
    height: 80,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cashbackText: {
    fontSize: 14,
    color: "#666",
  },
});

export default SpendingChartScreen;
