import React from "react";
import { View, Text, FlatList, StyleSheet, Image, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// Hardcoded transaction data
const transactions = [
  { category: "Food", amount: 50 },
  { category: "Food", amount: 30 },
  { category: "Gas", amount: 40 },
  { category: "Shopping", amount: 100 },
  { category: "Entertainment", amount: 60 },
  { category: "Food", amount: 20 },
];

// Update the credit cards data structure to use the same image
const amexGoldImage = require("../../assets/cards/amex-gold.png");
const chaseSapphirePreferredImage = require("../../assets/cards/chase-sapphire-preferred.png");
const capitalOneSavorImage = require("../../assets/cards/capital-one-savor.png");

const creditCardsByCategory = {
  Food: [
    { name: "Amex Gold", cashback: "4X points", image: amexGoldImage },
    { name: "Chase Sapphire Preferred", cashback: "3X points", image: chaseSapphirePreferredImage },
    { name: "Capital One Savor", cashback: "4% cash back", image: capitalOneSavorImage },
  ],
  Gas: [
    { name: "PenFed Platinum", cashback: "5% cash back", image: amexGoldImage },
    { name: "Citi Custom Cash", cashback: "5% cash back", image: amexGoldImage },
    { name: "Blue Cash Preferred", cashback: "3% cash back", image: amexGoldImage },
  ],
  Shopping: [
    { name: "Amazon Prime Visa", cashback: "5% cash back", image: amexGoldImage },
    { name: "Chase Freedom Unlimited", cashback: "1.5% cash back", image: amexGoldImage },
    { name: "Amex Platinum", cashback: "1X points", image: amexGoldImage },
  ],
  Entertainment: [
    { name: "Savor Rewards", cashback: "4% cash back", image: amexGoldImage },
    { name: "Wells Fargo Autograph", cashback: "3X points", image: amexGoldImage },
    { name: "Chase Freedom Flex", cashback: "5% cash back", image: amexGoldImage },
  ],
};

// Aggregate spending by category
const categoryTotals = transactions.reduce((acc, transaction) => {
  acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
  return acc;
}, {});

// Sort categories by amount and convert to pie chart data format
const pieChartData = Object.entries(categoryTotals)
  .sort(([, amountA], [, amountB]) => amountB - amountA) // Sort in descending order
  .map(([category, amount], index) => ({
    name: category,
    amount: amount,
    color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"][index % 4],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

// Update most spent category to use the first item from sorted data
const mostSpentCategory = pieChartData[0].name;

// Get the best credit cards for the most spent category
const topCreditCardsForMostSpent = creditCardsByCategory[mostSpentCategory] || [];

const SpendingChartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Breakdown</Text>

      {/* Pie Chart */}
      <PieChart
        data={pieChartData}
        width={screenWidth - 40}
        height={200}
        chartConfig={{ color: () => `rgba(0, 0, 0, 1)` }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>
          Best Cards for{' '}
          <Text style={styles.categoryHighlight}>
            {mostSpentCategory}
          </Text>
          {' '}Spending:
        </Text>
      </View>
      
      <View style={styles.cardsContainer}>
        {topCreditCardsForMostSpent.map((card, index) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    minHeight: Dimensions.get("window").height,
  },
  header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  sectionHeaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryHighlight: {
    fontStyle: 'italic',
    color: '#FF6384', // You can change this color to match your app's theme
  },
  categoryTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  listItem: { fontSize: 14, marginLeft: 10, marginTop: 2 },
  cardsContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
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
