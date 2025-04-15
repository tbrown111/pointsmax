import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

export default function OnboardingQuestionnaire() {
  const router = useRouter();
  const [occupation, setOccupation] = useState('');
  const [rewardsPreference, setRewardsPreference] = useState('');
  const [travelFrequency, setTravelFrequency] = useState('');
  const [spendingFocus, setSpendingFocus] = useState('');
  const [studentStatus, setStudentStatus] = useState('');

  const handleSubmit = async () => {
    const userPreferences = {
      occupation,
      rewardsPreference,
      travelFrequency,
      spendingFocus,
      studentStatus,
    };

    try {
      const auth = getAuth();
      const db = getDatabase();
      const userId = auth.currentUser?.uid;

      if (userId) {
        const preferencesRef = ref(db, `User_Transactions/${userId}/Preferences`);
        await set(preferencesRef, userPreferences);
        Alert.alert('Preferences Saved', 'We\'ll use these to personalize your experience.');
        router.replace('/');
      } else {
        Alert.alert('Error', 'No user is currently signed in.');
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      Alert.alert('Error', 'Failed to save preferences.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Tell Us About Yourself</Text>

        <Text style={styles.label}>What is your current occupation?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Student, Engineer"
          value={occupation}
          onChangeText={setOccupation}
        />

        <Text style={styles.label}>Do you prefer travel rewards, cash back, or points?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Travel rewards"
          value={rewardsPreference}
          onChangeText={setRewardsPreference}
        />

        <Text style={styles.label}>How often do you travel?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Frequently, Occasionally, Rarely"
          value={travelFrequency}
          onChangeText={setTravelFrequency}
        />

        <Text style={styles.label}>Where do you spend the most money?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Dining, Groceries, Entertainment"
          value={spendingFocus}
          onChangeText={setSpendingFocus}
        />

        <Text style={styles.label}>Are you a student?</Text>
        <TextInput
          style={styles.input}
          placeholder="Yes or No"
          value={studentStatus}
          onChangeText={setStudentStatus}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CD964',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#4CD964',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});