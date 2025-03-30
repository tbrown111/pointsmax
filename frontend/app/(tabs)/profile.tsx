import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
    <LinearGradient colors={["#87CEFA", "#4682B4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.userInfo}>Email: {userEmail}</Text>

        {/* <DropDownPicker
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
        /> */}
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