// frontend/app/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // States for your spending form:
  const [spendingCategory, setSpendingCategory] = useState("");
  const [spendingAmount, setSpendingAmount] = useState("");
  const [spendingNote, setSpendingNote] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
      } else {
        setUser(currentUser);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Checking Auth...</Text>
      </View>
    );
  }

  const handleSubmit = () => {
    const spendingData = {
      category: spendingCategory,
      amount: spendingAmount,
      note: spendingNote,
      date: new Date().toISOString(),
    };
    console.log("Submitted Spending:", spendingData);
    // Reset inputs if desired:
    setSpendingCategory("");
    setSpendingAmount("");
    setSpendingNote("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Spending</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Groceries"
          value={spendingCategory}
          onChangeText={setSpendingCategory}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. 75.00"
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
          value={spendingNote}
          onChangeText={setSpendingNote}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Spending</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
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
    backgroundColor: "#007AFF",
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
