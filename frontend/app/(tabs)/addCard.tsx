import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Define interface for card type
interface CreditCard {
  id: string;
  name: string;
  bankName: string;
  image: any;
}

// Sample available cards data
const availableCards: CreditCard[] = [
  { 
    id: '1', 
    bankName: 'American Express',
    name: 'Gold Card', 
    image: require('../../assets/cards/amex-gold.png') 
  },
  { 
    id: '2', 
    bankName: 'Chase',
    name: 'Sapphire Preferred', 
    image: require('../../assets/cards/amex-gold.png') 
  },
  { 
    id: '3', 
    bankName: 'Capital One',
    name: 'Venture', 
    image: require('../../assets/cards/amex-gold.png') 
  },
  { 
    id: '4', 
    bankName: 'Citi',
    name: 'Double Cash', 
    image: require('../../assets/cards/amex-gold.png') 
  },
  // Add more cards as needed
];

const AddCardScreen = () => {
  const [userCards, setUserCards] = useState<CreditCard[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load user's cards on component mount
  useEffect(() => {
    loadUserCards();
  }, []);

  // Load cards from storage
  const loadUserCards = async () => {
    try {
      const savedCards = await AsyncStorage.getItem('userCards');
      if (savedCards) {
        setUserCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  // Save cards to storage
  const saveUserCards = async (cards: CreditCard[]) => {
    try {
      await AsyncStorage.setItem('userCards', JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving cards:', error);
    }
  };

  // Add card to user's collection
  const addCard = async (card: CreditCard) => {
    const updatedCards = [...userCards, card];
    setUserCards(updatedCards);
    await saveUserCards(updatedCards);
    setModalVisible(false);
    setSearchQuery('');
  };

  // Filter cards based on search query
  const filteredCards = availableCards.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Cards</Text>

        {userCards.length === 0 ? (
          <Text style={styles.noCardsText}>You don't have any cards</Text>
        ) : (
          <View style={styles.cardsContainer}>
            {userCards.map((card, index) => (
              <View key={`card-${index}`} style={styles.cardRow}>
                <View style={styles.imageContainer}>
                  <Image 
                    source={card.image}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName}>{card.name}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Card Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Search Modal - Updated position and layout */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        animationIn="slideInDown"
        animationOut="slideOutUp"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search cards..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#f5f7fa" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.searchResults}>
            {filteredCards.map((card) => (
              <View key={card.id} style={styles.searchResultRow}>
                <Image 
                  source={card.image}
                  style={styles.searchResultImage}
                  resizeMode="contain"
                />
                <View style={styles.cardTextContainer}>
                  <Text style={styles.bankName}>{card.bankName}</Text>
                  <Text style={styles.searchResultText}>{card.name}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addCardButton}
                  onPress={() => addCard(card)}
                >
                  <Ionicons name="add-circle" size={24} color="#4CD964" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
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
    color: '#000000',
  },
  noCardsText: {
    fontSize: 16,
    color: '#aa92ec',
    textAlign: 'center',
    marginTop: 20,
  },
  cardsContainer: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    width: 160,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: 100,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#f5f7fa',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.8,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#4dc964',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f7fa',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#f5f7fa',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    color: '#232c54',
  },
  closeButton: {
    padding: 5,
  },
  searchResults: {
    maxHeight: Dimensions.get('window').height * 0.6,
    padding: 15,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  searchResultImage: {
    width: 60,
    height: 40,
    marginRight: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bankName: {
    fontSize: 12,
    color: '#232c54',
    marginBottom: 2,
  },
  searchResultText: {
    fontSize: 16,
    color: '#232c54',
    fontWeight: '500',
  },
  addCardButton: {
    padding: 5,
  },
});



export default AddCardScreen;
