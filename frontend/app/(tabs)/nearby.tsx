import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface NearbyBusiness {
  displayName: {
    text: string;
    languageCode: string;
  };
  primaryTypeDisplayName: {
    text: string;
    languageCode: string;
  };
}

interface NearbyBusinessesResponse {
  places: NearbyBusiness[];
}

export default function NearbyLocationsScreen() {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [loading, setLoading] = useState(true);

//   // Handle authentication
//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         setUserEmail(user.email ?? '');
//       }
//     });
//   }, []);

  // Fetch nearby businesses on component mount
  useEffect(() => {
    const fetchNearbyBusinesses = async () => {
      try {
        const latitude = 33.776587; // Example latitude, you can get this dynamically
        const longitude = -84.389539; // Example longitude, you can get this dynamically
        const url = `https://api-zto2acvx6a-uc.a.run.app/nearby_businesses?latitude=${latitude}&longitude=${longitude}`

        console.log(url)
        const response = await fetch(url);
        const data: NearbyBusinessesResponse = await response.json();
        console.log('YO')
        // Set businesses data
        setBusinesses(data.places || []);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching nearby businesses:", err);
        setLoading(false);
      }
    };

    fetchNearbyBusinesses();
  }, []);

  const renderBusinessItem = ({ item }: { item: NearbyBusiness }) => (
    <View style={styles.businessItem}>
      <Text style={styles.businessName}>{item.displayName.text}</Text>
      <Text style={styles.businessType}>{item.primaryTypeDisplayName.text}</Text>
    </View>
  );

  // Return the component UI
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nearby Businesses</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : businesses.length > 0 ? (
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noBusinessesText}>No nearby businesses found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  businessItem: {
    backgroundColor: '##4CD964',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '500',
  },
  businessType: {
    color: '#4CD964',
    marginTop: 4,
  },
  noBusinessesText: {
    fontSize: 14,
    color: '#4CD964',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});