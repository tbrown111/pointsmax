import React, { useState } from "react";
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
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BarChart /*, PieChart */ } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const TrackSpending = () => {
  const [spendingCategory, setSpendingCategory] = useState("");
  const [spendingAmount, setSpendingAmount] = useState("");
  const [spendingNote, setSpendingNote] = useState("");

  // Control the visibility of the Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Toggle whether to show the chart
  const [showChart, setShowChart] = useState(false);

  // Hard-coded spending entries for the list
  const [spendings, setSpendings] = useState([
    {
      category: "Groceries",
      amount: "25.50",
      note: "Fruits and veggies",
      date: "2023-03-25T14:23:00",
    },
    {
      category: "Transport",
      amount: "40.00",
      note: "Bus tickets",
      date: "2023-03-26T09:10:00",
    },
    {
      category: "Entertainment",
      amount: "15.00",
      note: "Movie night",
      date: "2023-03-27T20:05:00",
    },
  ]);

  // Hard-coded data for BarChart (Reward Analysis)
  const [barData, setBarData] = useState({
    labels: ["Travel", "Dining", "Grocery"],
    datasets: [
      {
        data: [50, 80, 30], // Example reward analysis values for each category
      },
    ],
  });

  // Handle adding a new spending and making a POST request (temporarily commented out)
  const handleAddSpending = async () => {
    if (!spendingCategory || !spendingAmount) {
      Alert.alert("Error", "Please select a category and enter an amount.");
      return;
    }

    // Instead, we directly update the local state with the new spending
    const newSpending = {
      category: spendingCategory,
      amount: spendingAmount,
      note: spendingNote,
      date: new Date().toISOString(),
    };
    setSpendings((prev) => [...prev, newSpending]);
    Alert.alert("Spending Added", "Your spending has been recorded locally!");
    setSpendingCategory("");
    setSpendingAmount("");
    setSpendingNote("");
    setModalVisible(false);
    // Note: The bar chart remains static with the temporary data
  };

  // Responsive width for charts
  const screenWidth = Dimensions.get("window").width;

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
          <Text style={styles.header}>Transactions</Text>

          {/* Top "Chart" Button */}
          <View style={styles.chartButtonContainer}>
            <TouchableOpacity
              style={styles.chartToggleButton}
              onPress={() => setShowChart(!showChart)}
            >
              <Text style={styles.chartToggleButtonText}>View Chart</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Conditionally Render the Bar Chart */}
            {showChart && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  Reward Analysis by Category
                </Text>
                <BarChart
                  data={barData}
                  width={screenWidth * 0.8}
                  height={220}
                  fromZero={true}
                  chartConfig={{
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    fillShadowGradient: "#4CD964",
                    fillShadowGradientOpacity: 1,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: "",
                      stroke: "#e3e3e3",
                      strokeWidth: 1,
                    },
                  }}
                  style={{ marginVertical: 8, borderRadius: 16 }}
                />
              </View>
            )}
            {/*
            // The PieChart portion has been commented out for A/B testing purposes.
            {showChart && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Spending Breakdown</Text>
                <PieChart
                  data={pieData}
                  width={screenWidth * 0.9}
                  height={220}
                  chartConfig={{
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    color: () => `#33691e`,
                  }}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"25"}
                  absolute
                />
              </View>
            )}
            */}
          </ScrollView>
          {/* Transaction List */}
          <FlatList
            data={spendings}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.spendingItem}>
                <View style={styles.spendingContainer}>
                  <Text style={styles.spendingItemCategory}>
                    {item.category}
                  </Text>
                  <Text style={styles.spendingItemAmount}>${item.amount}</Text>
                </View>
                {item.note && (
                  <Text style={styles.spendingItemNote}>{item.note}</Text>
                )}
                <Text style={styles.spendingItemDate}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
        {/* Add Card Button */}
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
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Category</Text>
                  <Picker
                    selectedValue={spendingCategory}
                    onValueChange={(itemValue) =>
                      setSpendingCategory(itemValue)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select category..." value="" />
                    <Picker.Item label="Travel" value="Travel" />
                    <Picker.Item label="Dining" value="Dining" />
                    <Picker.Item label="Grocery" value="Grocery" />
                  </Picker>
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
    color: "#000000",
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
  scrollContainer: {
    paddingBottom: 0,
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
    color: "#000000",
    marginBottom: 12,
  },
  spendingItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spendingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  spendingItemAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "green",
    marginLeft: 10,
  },
  spendingItemCategory: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  spendingItemNote: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  spendingItemDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 6,
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
  picker: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
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
    flexGrow: 1,
    padding: 0,
  },
  keyboardModal: {
    paddingTop: 15,
  },
});
