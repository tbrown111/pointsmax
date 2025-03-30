import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
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
    <LinearGradient colors={["#87CEFA", "#4682B4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.userInfo}>Email: {userEmail}</Text>
        <Text style={styles.userInfo}>User ID: {userId}</Text>

        <DropDownPicker
          open={open}
          value={category}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          placeholder="Select a category"
          style={styles.dropdown}
          textStyle={{ color: 'white' }}
          dropDownContainerStyle={{ backgroundColor: '#2c2c2e' }}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <View style={styles.buttonWrapper}>
          <Button title="Add Spending" color="#00008B" onPress={handleSubmit} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Logout" color="#00008B" onPress={handleLogout} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  userInfo: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: 20,
    backgroundColor: '#2c2c2e',
    borderColor: '#3a3a3c',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3a3a3c',
    backgroundColor: '#2c2c2e',
    color: 'white',
    padding: 10,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginTop: 12,
  },
});