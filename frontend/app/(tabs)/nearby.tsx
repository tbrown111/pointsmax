import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { askOpenAI } from "./openaiHelper";

/* ──────────── type defs ──────────── */
interface NearbyBusiness {
  displayName: { text: string; languageCode: string };
  primaryTypeDisplayName: { text: string; languageCode: string };
}

interface CardsResponse {
  [slug: string]: { name: string; imageUrl: string };
}

interface BestCardResponse {
  bestCards: string[];
  earnRate: number;
}

/* ──────────── component ──────────── */
export default function RecommendationsScreen() {
  const insets = useSafeAreaInsets(); // <‑‑ safe‑area padding

  /* ──────────── state ──────────── */
  const [userId, setUserId] = useState("FMOdmVLVTwfwNY0bSq0SBxr1aZl1");
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [cardsInfo, setCardsInfo] = useState<CardsResponse>({});
  const [bestCardData, setBestCardData] = useState<
    Record<number, BestCardResponse | "loading">
  >({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* user‑card quick‑recommendation */
  const [userCardIds, setUserCardIds] = useState<string[]>([]);
  const [purchaseDesc, setPurchaseDesc] = useState("");
  const [recommendedCard, setRecommendedCard] = useState<string | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  /* ──────────── Firebase auth ──────────── */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsub;
  }, []);

  /* ──────────── fetch user cards ──────────── */
  useEffect(() => {
    async function fetchUserCards(uid: string) {
      try {
        const res = await fetch(
          `https://api-zto2acvx6a-uc.a.run.app/user_cards?user_id=${uid}`
        );
        const ids: string[] = await res.json();
        setUserCardIds(ids);
      } catch (err) {
        console.error("Error fetching user cards:", err);
      }
    }
    if (userId) fetchUserCards(userId);
  }, [userId]);

  /* ──────────── fetch cards meta ──────────── */
  useEffect(() => {
    fetch("https://api-zto2acvx6a-uc.a.run.app/cards")
      .then((r) => r.json())
      .then(setCardsInfo)
      .catch((err) => console.error("Error fetching cards list:", err));
  }, []);

  /* ──────────── fetch nearby businesses ──────────── */
  useEffect(() => {
    async function fetchNearbyBusinesses() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Permission to access location was denied");
          return;
        }
        const { coords } = await Location.getCurrentPositionAsync({});
        const url = `https://api-zto2acvx6a-uc.a.run.app/nearby_businesses?latitude=${coords.latitude}&longitude=${coords.longitude}`;
        const res = await fetch(url);
        const data = await res.json();
        setBusinesses(data.places || []);
      } catch (err) {
        console.error("Error fetching nearby businesses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNearbyBusinesses();
  }, []);

  /* ──────────── GPT quick recommendation ──────────── */
  const handleRecommendPress = useCallback(async () => {
    if (!purchaseDesc.trim()) return;
    setRecLoading(true);
    setRecommendedCard(null);
    try {
      const prompt = `I have these credit cards: ${userCardIds.join(
        ", "
      )}. For the following purchase: "${purchaseDesc}", which of my cards should I use to maximise rewards? Respond with the card slug only.`;
      const response = await askOpenAI(prompt);
      const cleanSlug = response
        .trim()
        .replace(/[^a-z0-9-]/gi, "")
        .toLowerCase();
      setRecommendedCard(cleanSlug);
    } catch (err) {
      console.error("Error fetching recommendation from OpenAI:", err);
    } finally {
      setRecLoading(false);
    }
  }, [purchaseDesc, userCardIds]);

  /* ──────────── tap on a business row ──────────── */
  const handleBusinessPress = useCallback(
    async (item: NearbyBusiness, index: number) => {
      if (expandedIndex === index) {
        setExpandedIndex(null);
        return;
      }

      if (bestCardData[index] && bestCardData[index] !== "loading") {
        setExpandedIndex(index);
        return;
      }

      setBestCardData((p) => ({ ...p, [index]: "loading" }));
      setExpandedIndex(index);

      try {
        const base = "https://api-zto2acvx6a-uc.a.run.app/location_best_card";
        const url =
          `${base}?user_id=${encodeURIComponent(userId)}` +
          `&businessName=${encodeURIComponent(item.displayName.text)}` +
          `&categoryName=${encodeURIComponent(
            item.primaryTypeDisplayName.text
          )}`;
        const res = await fetch(url);
        const data: BestCardResponse = await res.json();
        setBestCardData((p) => ({ ...p, [index]: data }));
      } catch (err) {
        console.error("Error fetching best cards:", err);
        setBestCardData((p) => {
          const copy = { ...p };
          delete copy[index];
          return copy;
        });
        setExpandedIndex(null);
      }
    },
    [userId, expandedIndex, bestCardData]
  );

  /* ──────────── helpers ──────────── */
  const renderCards = (cards: string[]) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.cardScroll}
    >
      {cards.map((slug) => {
        const card = cardsInfo[slug];
        if (!card) return null;
        return (
          <View key={slug} style={styles.card}>
            <Image
              source={{ uri: card.imageUrl }}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardLabel}>{card.name}</Text>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderBusinessItem = ({
    item,
    index,
  }: {
    item: NearbyBusiness;
    index: number;
  }) => {
    const isExpanded = expandedIndex === index;
    const bestData = bestCardData[index];

    return (
      <TouchableOpacity
        style={[styles.businessItem, isExpanded && styles.businessItemExpanded]}
        onPress={() => handleBusinessPress(item, index)}
      >
        {/* header row */}
        <View style={styles.row}>
          <View style={styles.infoBlock}>
            <Text
              style={styles.businessName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.displayName.text}
            </Text>
            <Text style={styles.businessType}>
              {item.primaryTypeDisplayName.text}
            </Text>
          </View>
          <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
        </View>

        {/* expanded */}
        {isExpanded && (
          <View style={styles.expandedArea}>
            {bestData === "loading" ? (
              <ActivityIndicator size="small" />
            ) : bestData ? (
              <>
                <Text style={styles.earnRate}>
                  💰 Earn rate: {bestData.earnRate}x
                </Text>
                {renderCards(bestData.bestCards)}
              </>
            ) : (
              <Text style={styles.errorText}>No recommendation available</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /* ──────────── UI ──────────── */
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.loadingContainer, { paddingTop: insets.top }]}
      >
        <ActivityIndicator size="large" color="#4CD964" />
        <Text style={styles.loadingText}>Finding nearby places…</Text>
      </SafeAreaView>
    );
  }

  const recommendedCardInfo =
    recommendedCard && cardsInfo[recommendedCard]
      ? cardsInfo[recommendedCard]
      : null;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* title & description */}
      <Text style={styles.heading} numberOfLines={1} adjustsFontSizeToFit>
        Recommendations
      </Text>
      <Text style={styles.subheading}>
        Recommend card by input and location
      </Text>

      {/* quick GPT recommendation */}
      <View style={styles.recommendBox}>
        <TextInput
          value={purchaseDesc}
          onChangeText={setPurchaseDesc}
          placeholder="e.g. $45 dinner at Olive Garden"
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.recommendBtn}
          onPress={handleRecommendPress}
          disabled={recLoading}
        >
          <Text style={styles.recommendBtnText}>
            {recLoading ? "…" : "Recommend"}
          </Text>
        </TouchableOpacity>
      </View>

      {recommendedCardInfo && (
        <View style={styles.recommendedCardBox}>
          <Image
            source={{ uri: recommendedCardInfo.imageUrl }}
            style={styles.recommendedCardImage}
            resizeMode="contain"
          />
          <Text style={styles.recommendedCardName}>
            {recommendedCardInfo.name}
          </Text>
        </View>
      )}

      {/* divider */}
      <View style={styles.divider} />

      {/* bottom list */}
      <Text style={styles.sectionHeading}>Nearby businesses</Text>

      {businesses.length ? (
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noBusinessesText}>No nearby businesses found.</Text>
      )}
    </SafeAreaView>
  );
}

/* ──────────── styles ──────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 20,
    color: "#333",
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
  },

  /* quick GPT recommendation */
  recommendBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  recommendBtn: {
    backgroundColor: "#4CD964",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  recommendBtnText: { color: "#fff", fontWeight: "600" },

  /* chosen card result */
  recommendedCardBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f6fff9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  recommendedCardImage: { width: 50, height: 30, marginRight: 12 },
  recommendedCardName: { flexShrink: 1, fontWeight: "600", color: "#222" },

  /* divider */
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    marginVertical: 12,
  },

  /* bottom section */
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 8,
    color: "#333",
  },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  businessItem: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  businessItemExpanded: { backgroundColor: "#f0fff4" },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBlock: { flex: 1, paddingRight: 8 },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flexShrink: 1,
    lineHeight: 20,
  },
  businessType: { marginTop: 2, color: "#666" },
  chevron: { fontSize: 18, color: "#888", marginLeft: 4, alignSelf: "center" },

  expandedArea: { marginTop: 12 },
  earnRate: { fontWeight: "600", marginBottom: 6, color: "#222" },

  cardScroll: { paddingVertical: 4 },
  card: {
    width: 140,
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  cardImage: { width: 100, height: 60 },
  cardLabel: { marginTop: 4, fontSize: 12, textAlign: "center", color: "#444" },

  /* misc */
  noBusinessesText: { textAlign: "center", marginTop: 40, color: "#888" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666" },
  errorText: { color: "#888" },
});
