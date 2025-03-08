import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // or use 'react-native-linear-gradient'

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  return (
    <LinearGradient colors={["#FF7E5F", "#FD3A69"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PointsMax</Text>
          <Text style={styles.subtitle}>
            Maximize your points, maximize your life
          </Text>
        </View>

        {/* Content Cards */}
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Track Your Spending</Text>
            <Text style={styles.cardDescription}>
              Monitor your expenses and gain insights to optimize your spending
              habits.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Find Best Credit Cards</Text>
            <Text style={styles.cardDescription}>
              Discover credit card options tailored to your lifestyle and
              spending patterns.
            </Text>
          </View>

          {/* Call-to-Action Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 10,
  },
  content: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    width: width - 40,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FD3A69",
  },
});

export default HomeScreen;
