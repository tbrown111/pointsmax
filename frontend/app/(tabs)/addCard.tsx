import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
// Removed AsyncStorage import since we now rely on API calls for user cards
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

// Define interface for card type
interface CreditCard {
  id: string;
  name: string;
  bankName: string;
  image: any;
}

const AddCardScreen = () => {
  // Instead of storing user cards in local storage, we store the list of card IDs for the user.
  const [userCardIds, setUserCardIds] = useState<string[]>([]);
  const [cardsFromAPI, setCardsFromAPI] = useState<CreditCard[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Listen to Firebase auth state and fetch user cards if the user is logged in
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email ?? "");
        fetchUserCards(user.uid);
      } else {
        setUserId("");
        setUserEmail("");
        setUserCardIds([]);
      }
    });
  }, []);

  // Fetch available cards details from the API
  useEffect(() => {
    fetchAvailableCards();
  }, []);

  // Helper function to derive bank name from card id
  const getBankNameFromId = (id: string): string => {
    if (id.startsWith("chase")) return "Chase";
    if (id.startsWith("amex")) return "American Express";
    if (id.startsWith("capitalone")) return "Capital One";
    if (id.startsWith("boa")) return "Bank of America";
    if (id.startsWith("citi")) return "Citi";
    if (id.startsWith("discover")) return "Discover";
    return "";
  };

  // Fetch available cards data from API and convert it to an array
  const fetchAvailableCards = async () => {
    try {
      const response = await fetch("https://api-zto2acvx6a-uc.a.run.app/cards");
      const jsonData = await response.json();
      const cardsArray: CreditCard[] = Object.entries(jsonData).map(
        ([key, value]: [string, any]) => ({
          id: key,
          name: value.name,
          bankName: getBankNameFromId(key),
          image: { uri: value.imageUrl },
        })
      );
      setCardsFromAPI(cardsArray);
    } catch (error) {
      console.error("Error fetching cards data:", error);
    }
  };

  // Fetch user's saved card IDs from backend using the user_id query parameter
  const fetchUserCards = async (uid: string) => {
    try {
      const response = await fetch(
        `https://api-zto2acvx6a-uc.a.run.app/user_cards?user_id=${uid}`
      );
      const cardIds: string[] = await response.json();
      setUserCardIds(cardIds);
    } catch (error) {
      console.error("Error fetching user cards:", error);
    }
  };

  // Add card to user's collection by updating local state (and ideally via a backend API)
  const addCard = async (card: CreditCard) => {
    // In a complete implementation, you might call an API endpoint to update the user's cards.
    const updatedCardIds = [...userCardIds, card.id];
    setUserCardIds(updatedCardIds);
    setModalVisible(false);
    setSearchQuery("");
  };

  // Compute the list of cards to render by filtering available cards with user's card IDs.
  const displayedUserCards = cardsFromAPI.filter((card) =>
    userCardIds.includes(card.id)
  );

  // Filter available cards for search modal based on search query.
  const filteredCards = cardsFromAPI.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Your Cards</Text>

        {displayedUserCards.length === 0 ? (
          <Text style={styles.noCardsText}>You don't have any cards</Text>
        ) : (
          <View style={styles.cardsContainer}>
            {displayedUserCards.map((card, index) => (
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

      {/* Search Modal */}
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
    backgroundColor: "#f5f7fa",
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
    color: "#000000",
  },
  noCardsText: {
    fontSize: 16,
    color: "#aa92ec",
    textAlign: "center",
    marginTop: 20,
  },
  cardsContainer: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CD964",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    justifyContent: "flex-start",
  },
  modalContent: {
    backgroundColor: "#f5f7fa",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: Dimensions.get("window").height * 0.8,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    backgroundColor: "#4dc964",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f7fa",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#f5f7fa",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginRight: 10,
    color: "#232c54",
  },
  closeButton: {
    padding: 5,
  },
  searchResults: {
    maxHeight: Dimensions.get("window").height * 0.6,
    padding: 15,
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
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
    color: "#232c54",
    marginBottom: 2,
  },
  searchResultText: {
    fontSize: 16,
    color: "#232c54",
    fontWeight: "500",
  },
  addCardButton: {
    padding: 5,
  },
});

export default AddCardScreen;
