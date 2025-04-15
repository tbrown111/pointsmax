import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

type UserPreferences = {
  occupation: string;
  rewardsPreference: string;
  travelFrequency: string;
  spendingFocus: string;
  studentStatus: string;
};

export default function ProfileScreen() {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setUserId(uid);
        setUserEmail(user.email ?? '');
        fetchPreferences(uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchPreferences = async (uid: string) => {
    try {
      const db = getDatabase();
      const prefRef = ref(db, `User_Transactions/${uid}/Preferences`);
      const snapshot = await get(prefRef);
      if (snapshot.exists()) {
        setPreferences(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching preferences', error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const db = getDatabase();
      const prefRef = ref(db, `User_Transactions/${userId}/Preferences`);
      await set(prefRef, preferences);
      setEditing(false);
      Alert.alert('Success', 'Preferences updated!');
    } catch (err) {
      console.error('Error updating preferences:', err);
      Alert.alert('Error', 'Failed to update preferences.');
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
          <Text style={styles.cardName}>Email:</Text>
          <Text style={styles.cashbackText}>{userEmail}</Text>
          <Text style={styles.cardName}>User ID:</Text>
          <Text style={styles.cashbackText}>{userId}</Text>
        </View>

        {/* Preferences Section */}
        {preferences && (
          <View style={styles.cardRow}>
            <Text style={styles.cardName}>Preferences:</Text>

            {editing ? (
              <>
                {Object.entries(preferences).map(([key, value]) => (
                  <View key={key} style={{ marginBottom: 10 }}>
                    <Text style={styles.inputLabel}>{key}:</Text>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={(text) =>
                        setPreferences({ ...preferences, [key]: text })
                      }
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.logoutbutton, { backgroundColor: '#4CD964' }]}
                  onPress={handleSavePreferences}
                >
                  <Text style={styles.buttonText}>Save Preferences</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cashbackText}>Occupation: {preferences.occupation}</Text>
                <Text style={styles.cashbackText}>Rewards: {preferences.rewardsPreference}</Text>
                <Text style={styles.cashbackText}>Travel: {preferences.travelFrequency}</Text>
                <Text style={styles.cashbackText}>Spending Focus: {preferences.spendingFocus}</Text>
                <Text style={styles.cashbackText}>Student: {preferences.studentStatus}</Text>

                <TouchableOpacity
                  style={[styles.logoutbutton, { backgroundColor: '#007AFF' }]}
                  onPress={() => setEditing(true)}
                >
                  <Text style={styles.buttonText}>Edit Preferences</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7fa' },
  scrollContent: { padding: 20, paddingTop: 50 },
  header: { fontSize: 34, fontWeight: 'bold', marginBottom: 30, color: '#000' },
  cardRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardName: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  cashbackText: { fontSize: 14, color: '#666', marginBottom: 4 },
  logoutbutton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    color: '#000',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});