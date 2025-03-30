import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Dining', value: 'Dining' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Grocery', value: 'Grocery' }
  ]);

  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email ?? '');
      }
    });
  }, []);

  const getBaseUrl = () => {
    if (__DEV__) {
      return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
    }
    return 'https://4d374e93-524c-4f29-b786-21fa45a08909.us-east-1.cloud.genez.io';
  };

  const handleSubmit = async () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await axios.post(
        `${getBaseUrl()}/add_spending`,
        {
          user_id: userId,
          spend_category: category,
          amount: parseInt(amount),
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      Alert.alert('Success', 'Transaction added!');
      setAmount('');
      setCategory('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add spending');
      console.error(error);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => Alert.alert('Signed out successfully'))
      .catch((error) => Alert.alert('Error signing out', error.message));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Profile</Text>

        {/* User Info Card */}
        <View style={styles.cardRow}>
          <View style={styles.cardDetails}>
            <Text style={styles.cardName}>Email:</Text>
            <Text style={styles.cashbackText}>{userEmail}</Text>
            <Text style={styles.cardName}>User ID:</Text>
            <Text style={styles.cashbackText}>{userId}</Text>
          </View>
        </View>

        {/* Spending Input Card */}
        <View style={styles.cardRow}>
          <Text style={styles.cardName}>Select Spending Category:</Text>
          <DropDownPicker
            open={open}
            value={category}
            items={items}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setItems}
            placeholder="Select a category"
            style={styles.dropdown}
            textStyle={{ color: "#333" }}
            dropDownContainerStyle={{ backgroundColor: "#ffffff" }}
          />
          <Text style={styles.label}>Enter Spending Amount:</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Spending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
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
  cardRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "center",
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
  dropdown: {
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffff",
    color: "#333",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonWrapper: {
    marginTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  button: {
    backgroundColor: '#4CD964',  // Green background
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutbutton: {
    backgroundColor: '#FF3B30',  // Green background
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;