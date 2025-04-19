/**
 * NearbyLocationsScreen.tsx
 * -------------------------------------------------------------
 * Shows nearby businesses, then (on tap) fetches + displays the
 * best credit‑card recommendations with images & earn rate.
 * Long business names now wrap cleanly instead of overflowing.
 * -------------------------------------------------------------
 */
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
} from "react-native";

import { getAuth, onAuthStateChanged } from "firebase/auth";

/* ──────────── type defs ──────────── */
interface NearbyBusiness {
  displayName: { text: string; languageCode: string };
  primaryTypeDisplayName: { text: string; languageCode: string };
}

interface NearbyBusinessesResponse {
  places: NearbyBusiness[];
}

interface CardsResponse {
  [slug: string]: { name: string; imageUrl: string };
}

interface BestCardResponse {
  bestCards: string[];
  earnRate: number;
}

export default function NearbyLocationsScreen() {
  /* ──────────── state ──────────── */
  const [userId, setUserId] = useState("FMOdmVLVTwfwNY0bSq0SBxr1aZl1"); // fallback UID
  const [businesses, setBusinesses] = useState<NearbyBusiness[]>([]);
  const [cardsInfo, setCardsInfo] = useState<CardsResponse>({});
  const [bestCardData, setBestCardData] = useState<
    Record<number, BestCardResponse | "loading">
  >({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  /* ──────────── Firebase auth (optional) ──────────── */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return unsub;
  }, []);

  /* ──────────── fetch cards meta ──────────── */
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch("https://api-zto2acvx6a-uc.a.run.app/cards");
        const data: CardsResponse = await res.json();
        setCardsInfo(data);
      } catch (err) {
        console.error("Error fetching cards list:", err);
      }
    };
    fetchCards();
  }, []);

  /* ──────────── fetch nearby businesses ──────────── */
  useEffect(() => {
    const fetchNearbyBusinesses = async () => {
      try {
        const latitude = 33.776587;
        const longitude = -84.389539;
        const url = `https://api-zto2acvx6a-uc.a.run.app/nearby_businesses?latitude=${latitude}&longitude=${longitude}`;

        const response = await fetch(url);
        const data: NearbyBusinessesResponse = await response.json();

        setBusinesses(data.places || []);
      } catch (err) {
        console.error("Error fetching nearby businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyBusinesses();
  }, []);

  /* ──────────── handle press ──────────── */
  const handlePress = useCallback(
    async (item: NearbyBusiness, index: number) => {
      if (expandedIndex === index) {
        setExpandedIndex(null); // collapse
        return;
      }

      if (bestCardData[index] && bestCardData[index] !== "loading") {
        setExpandedIndex(index); // already cached
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

  /* ──────────── render helpers ──────────── */
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
        onPress={() => handlePress(item, index)}
      >
        {/* ── collapsed / header row ── */}
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

        {/* ── expanded content ── */}
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CD964" />
        <Text style={styles.loadingText}>Finding nearby places…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Nearby Businesses</Text>
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
    </View>
  );
}

/* ──────────── styles ──────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    padding: 20,
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

  /* row now allows wrapping text block */
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoBlock: {
    flex: 1, // takes remaining width
    paddingRight: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flexShrink: 1, // enable wrapping
    lineHeight: 20,
  },
  businessType: { marginTop: 2, color: "#666" },
  chevron: {
    fontSize: 18,
    color: "#888",
    marginLeft: 4,
    alignSelf: "center",
  },

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
  cardLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    color: "#444",
  },

  noBusinessesText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 12, color: "#666" },
  errorText: { color: "#888" },
});
