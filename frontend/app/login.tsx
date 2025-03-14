// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Welcome", `Signed in as: ${userCredential.user.email}`);
      router.replace("/"); // Navigate to main screen
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  const handleSignUp = async () => {
    console.log("Sign Up button pressed"); // Confirm the function is called
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", `User registered: ${userCredential.user.email}`);
    } catch (error: any) {
      console.log("Sign Up Error:", error); // Logs the entire error
      Alert.alert("Sign Up Error", error.message); // Shows an alert with the message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Sign Up</Text>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Light background
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#000", // Black text
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#000", // Black labels
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 12,
    color: "#000", // Ensure text is black
  },
});
