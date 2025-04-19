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
  useColorScheme,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CATEGORIES = ["Dining", "Travel", "Grocery", "Entertainment", "Gas"];

const TrackSpending = () => {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [spendingCategory, setSpendingCategory] = useState<string>("");
  const [spendingAmount, setSpendingAmount] = useState("");

  // Store individual spending transactions from server
  const [spendings, setSpendings] = useState<any[]>([]);

  // Control the visibility of the Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Toggle whether to show the chart
  const [showChart, setShowChart] = useState(false);

  // Data for the Pie Chart (fetched from Firebase)
  const [pieData, setPieData] = useState<any[]>([]);

  // Detect system colour scheme (light / dark)
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // When user logs in or out, update state
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
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

    return () => unsub();
  }, []);

  // Helper: Fetch the user's spending breakdown for the Pie Chart
  const fetchPieData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://api-zto2acvx6a-uc.a.run.app/spending_per_category?user_id=${userId}/Aggregated`
      );
      const result = await response.json();
      const chartData = CATEGORIES.map((cat, idx) => ({
        name: cat,
        population: result[cat] || 0,
        // simple distinct colour palette
        color: ["#4CD964", "#F39C12", "#3498DB", "#9B59B6", "#E74C3C"][idx],
        legendFontColor: isDark ? "#fff" : "#000",
        legendFontSize: 14,
      }));
      setPieData(chartData);
    } catch (error) {
      console.error("Error fetching pie data", error);
    }
  };

  // Helper: Fetch transactions for the current user
  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `https://api-zto2acvx6a-uc.a.run.app/transactions?user_id=${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user transactions");
      }
      const data = await response.json();
      setSpendings(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch transactions & chart data whenever userId changes (i.e., once user is known)
  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchPieData();
    }
  }, [userId]);

  // Handle adding a new spending and sending a POST request to the server
  const handleAddSpending = async () => {
    if (!spendingCategory || !spendingAmount) {
      Alert.alert("Error", "Please choose a category and enter an amount.");
      return;
    }

    try {
      const response = await fetch(
        "https://api-zto2acvx6a-uc.a.run.app/add_spending",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            spend_category: spendingCategory,
            amt: parseFloat(spendingAmount),
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Your spending has been recorded!");
        setSpendingCategory("");
        setSpendingAmount("");
        setModalVisible(false);
        fetchTransactions();
        fetchPieData();
      } else {
        const data = await response.json();
        Alert.alert(
          "Error",
          data.message || "There was an error adding your spending."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error adding your spending. Please try again."
      );
      console.error(error);
    }
  };

  const screenWidth = Dimensions.get("window").width;

  /** ---------- RENDER ---------- */
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

          {/* Top "Chart" Button */}
          <View style={styles.chartButtonContainer}>
            <TouchableOpacity
              style={styles.chartToggleButton}
              onPress={() => setShowChart(!showChart)}
            >
              <Text style={styles.chartToggleButtonText}>
                {showChart ? "Hide Chart" : "View Chart"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conditionally Render the Pie Chart */}
          {showChart && pieData.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Spending Breakdown</Text>
              <PieChart
                data={pieData}
                width={screenWidth * 0.9}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: () => `#777`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"10"}
                absolute
              />
            </View>
          )}

          {/* Transaction List */}
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

        {/* Add Spending Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        {/* Modal for adding new spending */}
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

                {/* Category Selector */}
                <View style={styles.categoryContainer}>
                  {CATEGORIES.map((cat) => {
                    const selected = cat === spendingCategory;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryButton,
                          selected && styles.categoryButtonActive,
                        ]}
                        onPress={() =>
                          setSpendingCategory((prev) =>
                            prev === cat ? "" : cat
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            selected && styles.categoryButtonTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Amount */}
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

                {/* Action Buttons */}
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

/* ---------- STYLES ---------- */
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
    color: "#000",
  },
  chartButtonContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  chartToggleButton: {
    backgroundColor: "#4CD964",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  avoidingView: {
    flex: 1,
  },
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
  keyboardModal: {
    paddingTop: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CD964",
    marginBottom: 16,
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryButton: {
    flexBasis: "48%",
    marginVertical: 4,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4CD964",
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#4CD964",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#4CD964",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
    color: "#4CD964",
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#4CD964",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 10,
    marginTop: 20,
  },
  listHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noTransactions: {
    fontSize: 16,
    color: "#777",
  },
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
  spendingCategory: {
    fontSize: 16,
    fontWeight: "bold",
  },
  spendingAmount: {
    fontSize: 16,
    color: "#4CD964",
  },
  spendingDate: {
    fontSize: 12,
    color: "#aaa",
  },
});
