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

const TrackSpending = () => {
  const [spendingCategory, setSpendingCategory] = useState("");
  const [spendingAmount, setSpendingAmount] = useState("");
  const [spendingNote, setSpendingNote] = useState("");

  const handleSubmit = () => {
    const spendingData = {
      category: spendingCategory,
      amount: spendingAmount,
      note: spendingNote,
      date: new Date().toISOString(),
    };
    console.log("Submitted Spending:", spendingData);
    Alert.alert("Spending Added", "Your spending has been recorded!");

    // Reset form fields
    setSpendingCategory("");
    setSpendingAmount("");
    setSpendingNote("");
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
        <Text style={styles.title}>Track Your Spending</Text>

        {/* Live Spending Card Preview */}
        <View style={styles.spendingCardPreview}>
          <Text style={styles.previewCategory}>
            {spendingCategory ? spendingCategory.toUpperCase() : "CATEGORY"}
          </Text>
          <Text style={styles.previewAmount}>
            {spendingAmount ? `$${spendingAmount}` : "$0.00"}
          </Text>
          <Text style={styles.previewNote}>
            {spendingNote ? spendingNote : "Add a note..."}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Groceries"
            placeholderTextColor="#777"
            value={spendingCategory}
            onChangeText={setSpendingCategory}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 75.00"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={spendingAmount}
            onChangeText={setSpendingAmount}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Any additional details"
            placeholderTextColor="#777"
            value={spendingNote}
            onChangeText={setSpendingNote}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add Spending</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4c3", // A light, fresh background color
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
    color: "#33691e",
  },
  spendingCardPreview: {
    backgroundColor: "#558b2f",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 180, // Taller preview for a more striking look
    justifyContent: "center",
  },
  previewCategory: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  previewAmount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  previewNote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
    color: "#33691e",
  },
  textInput: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#33691e",
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

export default TrackSpending;
