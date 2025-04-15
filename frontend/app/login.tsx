import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");

      Alert.alert('Welcome', `Signed in as: ${userCredential.user.email}`);

      if (onboardingComplete === 'true') {
        router.replace('/'); // Navigate to main screen
      } else {
        router.replace('/questionnaire'); // Navigate to questionnaire screen
      }
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Initialize spending data on backend
      await axios.post(
        "https://api-zto2acvx6a-uc.a.run.app/initialize_spending",
        { user_id: userId },
        { headers: { "Content-Type": "application/json" } }
      );

      // Save onboarding flag to trigger questionnaire
      await AsyncStorage.setItem("onboardingComplete", "false");

      Alert.alert('Success', `User registered: ${userCredential.user.email}`);
      router.replace('/questionnaire'); // Redirect to onboarding
    } catch (error: any) {
      Alert.alert("Sign Up Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.header}>
            <Text style={{ color: "black" }}>Welcome to </Text>
            <Text style={{ color: "#4CD964", fontStyle: "italic" }}>
              PointsMax
            </Text>
          </Text>

          <Text style={styles.title}>Log In / Sign Up</Text>

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

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.betweenText}>Don't have an account yet?</Text>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 12,
    color: "#000",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    paddingBottom: 40,
  },
  signInButton: {
    backgroundColor: "#4CD964",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  signUpButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  betweenText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginVertical: 8,
  },
});
