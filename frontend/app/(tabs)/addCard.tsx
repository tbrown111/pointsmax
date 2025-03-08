import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";

const AddCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [cardType, setCardType] = useState("");

  const handleSubmit = async () => {
    const cardData = {
      cardNumber,
      cardHolder,
      expiry,
      cvv,
      bank,
      cardType,
      dateAdded: new Date().toISOString(),
    };

    try {
      // Replace the URL with your server endpoint
      const response = await fetch("https://your-server.com/api/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      if (response.ok) {
        Alert.alert("Success", "Card added successfully!");
        // Reset form fields
        setCardNumber("");
        setCardHolder("");
        setExpiry("");
        setCvv("");
        setBank("");
        setCardType("");
      } else {
        Alert.alert("Error", "Failed to add card. Please try again.");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Your Credit Card</Text>

        {/* Creative Live Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardHeader}>
            <Text style={styles.bankName}>
              {bank ? bank.toUpperCase() : "BANK NAME"}
            </Text>
            <Text style={styles.cardTypeText}>
              {cardType ? cardType.toUpperCase() : "CARD TYPE"}
            </Text>
          </View>
          <Text style={styles.cardNumber}>
            {cardNumber
              ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
              : "XXXX XXXX XXXX XXXX"}
          </Text>
          <View style={styles.cardDetails}>
            <Text style={styles.cardHolder}>
              {cardHolder ? cardHolder.toUpperCase() : "CARDHOLDER"}
            </Text>
            <Text style={styles.expiry}>{expiry ? expiry : "MM/YY"}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="John Doe"
            placeholderTextColor="#777"
            value={cardHolder}
            onChangeText={setCardHolder}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bank</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Chase, Bank of America"
            placeholderTextColor="#777"
            value={bank}
            onChangeText={setBank}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Type</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Visa, MasterCard"
            placeholderTextColor="#777"
            value={cardType}
            onChangeText={setCardType}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.textInput}
              placeholder="MM/YY"
              placeholderTextColor="#777"
              value={expiry}
              onChangeText={setExpiry}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.textInput}
              placeholder="123"
              placeholderTextColor="#777"
              keyboardType="numeric"
              secureTextEntry={true}
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f7fa",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#00796b",
  },
  cardPreview: {
    backgroundColor: "#00796b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 220, // Increased height for a taller card preview
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  bankName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cardTypeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  cardNumber: {
    fontSize: 22,
    letterSpacing: 2,
    color: "#fff",
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHolder: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  expiry: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  inputContainer: {
    marginVertical: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 0.48,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
    color: "#004d40",
  },
  textInput: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#004d40",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddCard;
