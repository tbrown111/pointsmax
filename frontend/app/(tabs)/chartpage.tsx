import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

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

// Hardcoded best credit cards for each category
const creditCardsByCategory = {
  Food: ["Amex Gold", "Chase Sapphire Preferred", "Capital One Savor"],
  Gas: ["PenFed Platinum", "Citi Custom Cash", "Blue Cash Preferred"],
  Shopping: ["Amazon Prime Visa", "Chase Freedom Unlimited", "Amex Platinum"],
  Entertainment: ["Savor Rewards", "Wells Fargo Autograph", "Chase Freedom Flex"],
};

// Aggregate spending by category
const categoryTotals = transactions.reduce((acc, transaction) => {
  acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
  return acc;
}, {});

// Convert to pie chart data format
const pieChartData = Object.keys(categoryTotals).map((category, index) => ({
  name: category,
  amount: categoryTotals[category],
  color: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"][index % 4],
  legendFontColor: "#7F7F7F",
  legendFontSize: 15,
}));

// Determine the most spent category
const mostSpentCategory = Object.keys(categoryTotals).reduce((a, b) =>
  categoryTotals[a] > categoryTotals[b] ? a : b
);

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

      {/* Best Cards for Most Spent Category */}
      <Text style={styles.sectionHeader}>
        Best Cards for {mostSpentCategory} Spending:
      </Text>
      <FlatList
        data={topCreditCardsForMostSpent}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.listItem}>• {item}</Text>}
      />
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
  sectionHeader: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  categoryTitle: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  listItem: { fontSize: 14, marginLeft: 10, marginTop: 2 },
});

export default SpendingChartScreen;
