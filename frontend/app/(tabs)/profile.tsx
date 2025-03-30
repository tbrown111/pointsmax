import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
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

        {/* Buttons */}
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
  logoutbutton: {
    backgroundColor: '#FF3B30',
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