import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

/**
 * TrackSpending.tsx
 * -------------------------------------------------------------
 * A simple spending tracker that lets authenticated users record
 * transactions, see a list of them, and view a breakdown pie chart.
 *
 * ⚠️  Android Picker crash fix:
 *    - `selectedValue` **must** always be a string (never null).
 *    - We use the empty string "" as a sentinel for "not selected".
 * -------------------------------------------------------------
 */

/* ──────────── constants ──────────── */
const CATEGORIES = [
  "Dining",
  "Travel",
  "Grocery",
  "Entertainment",
  "Gas",
] as const;

type Category = (typeof CATEGORIES)[number];

/* ──────────── component ──────────── */
const TrackSpending: React.FC = () => {
  /* ---------- state ---------- */
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [spendingCategory, setSpendingCategory] = useState<string>(""); // sentinel ""
  const [spendingAmount, setSpendingAmount] = useState<string>("");

  const [spendings, setSpendings] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [pieData, setPieData] = useState<any[]>([]);

  /* ---------- auth listener ---------- */
  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email ?? "");
      } else {
        setUserId("");
        setUserEmail("");
        setSpendings([]);
        setPieData([]);
      }
    });
  }, []);

  /* ---------- fetch helpers ---------- */
  const fetchPieData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://api-zto2acvx6a-uc.a.run.app/spending_per_category?user_id=${userId}/Aggregated`
      );
      const result = await response.json();
      const chartData = [
        {
          name: "Dining",
          population: result.Dining || 0,
          color: "#4CD964",
          legendFontColor: "#000",
          legendFontSize: 14,
        },
        {
          name: "Travel",
          population: result.Travel || 0,
          color: "#F39C12",
          legendFontColor: "#000",
          legendFontSize: 14,
        },
        {
          name: "Grocery",
          population: result.Grocery || 0,
          color: "#3498DB",
          legendFontColor: "#000",
          legendFontSize: 14,
        },
        {
          name: "Entertainment",
          population: result.Entertainment || 0,
          color: "#9B59B6",
          legendFontColor: "#000",
          legendFontSize: 14,
        },
        {
          name: "Gas",
          population: result.Gas || 0,
          color: "#E74C3C",
          legendFontColor: "#000",
          legendFontSize: 14,
        },
      ];
      setPieData(chartData);
    } catch (error) {
      console.error("Error fetching pie data", error);
    }
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://api-zto2acvx6a-uc.a.run.app/transactions?user_id=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch user transactions");
      const data = await response.json();
      setSpendings(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  /* ---------- refresh when UID changes ---------- */
  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchPieData();
    }
  }, [userId]);

  /* ---------- add spending ---------- */
  const handleAddSpending = async () => {
    if (!spendingCategory || spendingCategory === "" || !spendingAmount) {
      Alert.alert("Error", "Please select a category and enter an amount.");
      return;
    }
    try {
      const response = await fetch(
        "https://api-zto2acvx6a-uc.a.run.app/add_spending",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            spend_category: spendingCategory,
            amt: parseFloat(spendingAmount),
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "API error");
      }
      Alert.alert("Success", "Your spending has been recorded!");
      setSpendingCategory("");
      setSpendingAmount("");
      setModalVisible(false);
      fetchTransactions();
      fetchPieData();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message ?? "Unknown error, please try again.");
    }
  };

  /* ---------- render ---------- */
  const screenWidth = Dimensions.get("window").width;
  const pickerTextColor = Platform.OS === "android" ? "#000" : "#4CD964";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.avoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.header}>Spending Tracker</Text>

          {/* Chart toggle */}
          <View style={styles.chartButtonContainer}>
            <TouchableOpacity
              style={styles.chartToggleButton}
              onPress={() => setShowChart((prev) => !prev)}
            >
              <Text style={styles.chartToggleButtonText}>View Chart</Text>
            </TouchableOpacity>
          </View>

          {/* Pie chart */}
          {showChart && pieData.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Spending Breakdown</Text>
              <PieChart
                data={pieData}
                width={screenWidth * 0.9}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: () => "#777",
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
            </View>
          )}

          {/* Transaction list */}
          <View style={styles.listContainer}>
            <Text style={styles.listHeader}>Transaction List</Text>
            {spendings.length === 0 ? (
              <Text style={styles.noTransactions}>No transactions yet.</Text>
            ) : (
              spendings.map((item) => (
                <View key={item.id} style={styles.spendingItem}>
                  <Text style={styles.spendingCategory}>{item.category}</Text>
                  <Text style={styles.spendingAmount}>${item.amount}</Text>
                  <Text style={styles.spendingDate}>
                    {new Date(item.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Floating add button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Add‑spending modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView style={styles.keyboardModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add New Spending</Text>

                {/* Category picker */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Category</Text>
                  <Picker
                    selectedValue={spendingCategory}
                    onValueChange={(val) => setSpendingCategory(val)}
                    style={[styles.picker, { color: pickerTextColor }]}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#4CD964"
                    mode="dropdown"
                  >
                    <Picker.Item
                      label="Select category..."
                      value=""
                      color="#999"
                    />
                    {CATEGORIES.map((cat) => (
                      <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                  </Picker>
                </View>

                {/* Amount input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Amount</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 75.00"
                    placeholderTextColor="#777"
                    keyboardType="decimal-pad"
                    value={spendingAmount}
                    onChangeText={setSpendingAmount}
                  />
                </View>

                {/* Action buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddSpending}
                  >
                    <Text style={styles.submitText}>Add Spending</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: "#888" }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.submitText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TrackSpending;

/* ──────────── styles ──────────── */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f7fa" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 50 },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
    color: "#000",
  },
  chartButtonContainer: { alignItems: "center", marginBottom: 10 },
  chartToggleButton: {
    backgroundColor: "#4CD964",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  chartToggleButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  avoidingView: { flex: 1 },
  chartContainer: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CD964",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  keyboardModal: { paddingTop: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CD964",
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: { marginBottom: 12 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: "600", color: "#4CD964" },
  textInput: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  pickerItem: {
    color: "#000",
    // width: 100, // fixes invisible items on some iOS builds
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  submitButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#4CD964",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  listContainer: { padding: 10, marginTop: 20 },
  listHeader: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  noTransactions: { fontSize: 16, color: "#777" },
  spendingItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  spendingCategory: { fontSize: 16, fontWeight: "bold" },
  spendingAmount: { fontSize: 16, color: "#4CD964" },
  spendingDate: { fontSize: 12, color: "#aaa" },
});
