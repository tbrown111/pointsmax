express = require('express');
db = require('./db/db.js');
dotenv = require('dotenv');
functions = require('firebase-functions')
const cors = require("cors")



const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

dotenv.config();

//for local hosting
const PORT = 3000;

//for remote hosting
app.listen(3000, () => {
  console.log(
    'Server is running on port 3000. Check the app on http://localhost:3000'
  );
});

const creditCards = {
  "chase-sapphirepreferred": {
    name: "Chase Sapphire Preferred®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/308260636.png"
  },
  "chase-sapphirereserve": {
    name: "Chase Sapphire Reserve®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/145450788.png"
  },
  "chase-freedomflex": {
    name: "Chase Freedom Flex®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/872692553.png"
  },
  "chase-freedomunlimited": {
    name: "Chase Freedom Unlimited®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1435429562.png"
  },
  "amex-blue": {
    name: "Blue from American Express®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1776154058.png"
  },
  "amex-centurion": {
    name: "Centurion® Card from American Express",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1544029857.png"
  },
  "amex-deltagold": {
    name: "Delta SkyMiles® Gold American Express",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1948519608.jpeg"
  },
  "amex-gold": {
    name: "American Express® Gold",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1448069716.png"
  },
  "amex-platinum": {
    name: "The Platinum Card",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1872018642.png"
  },
  "amex-green": {
    name: "American Express® Green",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/941130048.png"
  },
  "amex-deltablue": {
    name: "Delta SkyMiles® Blue American Express",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/175486701.png"
  },
  "amex-bluecasheveryday": {
    name: "Blue Cash Everyday®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1960784516.png"
  },
  "amex-bluecashpreferred": {
    name: "Blue Cash Preferred®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/837101971.png"
  },
  "capitalone-venturex": {
    name: "Venture X Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1020742267.png"
  },
  "capitalone-venture": {
    name: "Venture Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1557827741.png"
  },
  "capitalone-ventureone": {
    name: "VentureOne Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/609814409.png"
  },
  "capitalone-savor": {
    name: "SavorOne Dining Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1865776270.png"
  },
  "capitalone-savoronestudents": {
    name: "Savor Rewards for Students",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1143552390.png"
  },
  "capitalone-savorone": {
    name: "Savor Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/397863832.png"
  },
  "capitalone-quicksilver": {
    name: "Quicksilver Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/1522768206.png"
  },
  "boa-travelrewards": {
    name: "Bank of America® Travel Rewards",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/127180189.png"
  },
  "boa-travelrewardssecured": {
    name: "Bank of America® Travel Rewards Secured",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/518020984.png"
  },
  "boa-customizedcashrewardsstudents": {
    name: "Bank of America® Customized Cash Rewards for Students",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/2090254884.png"
  },
  "citi-doublecash": {
    name: "Citi Double Cash®",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/637923020.png"
  },
  "discover-cashback": {
    name: "Discover it® Cash Back",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/594770995.png"
  },
  "discover-studentcashback": {
    name: "Discover It® Student Cash Back",
    imageUrl: "https://rewardsccapi.blob.core.windows.net/ccr1212/18324931.png"
  }
};

app.get('/cards', (req, res) => {
  res.json(creditCards);
});


//example for  post
app.post("/add_card", async (req, res) => {
  const user_id = req.body.user_id;
  const card_id = req.body.card_id;
  try {
    const db_ref = 'User_Transactions/' + user_id + '/Cards';
    const user_card_ref = db.ref(db_ref);
    const snapshot = await user_card_ref.once('value');
    console.log(snapshot.val());
    if (snapshot.exists()) {
      cards = snapshot.val();
      if (!cards.hasOwnProperty(card_id)) {
        cards[String(card_id)] = '';
        await user_card_ref.set(cards);
        return res
          .status(200)
          .json({ message: `Key '${card_id}' added successfully!`, cards });
      } else {
        return res.status(200).json({
          message: `${card_id} already exists in the database.`,
          cards,
        });
      }
    } else {
      cards[String(card_id)] = '';
      await user_card_ref.set(cards);
      return res
          .status(200)
          .json({ message: `Key '${card_id}' added successfully!`, cards });
    }
  } catch (error) {
    console.error("Error updating database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/add_spending", async (req, res) => {
  const { user_id, spend_category, amt } = req.body;

  try {
    // 1. Push a new transaction under "User_Transactions/<user_id>/Transactions"
    const transactionsRef = db.ref(`User_Transactions/${user_id}/Transactions`);
    const newTxnRef = transactionsRef.push();
    await newTxnRef.set({
      category: spend_category,
      amount: amt,
      timestamp: Date.now(),
    });

    // 2. Update the aggregated total for that category
    const categoryRef = db.ref(
      `User_Transactions/${user_id}/Aggregated/${spend_category}`
    );
    const snapshot = await categoryRef.once("value");
    let curr_amt = snapshot.val() || 0;

    curr_amt += amt;
    await categoryRef.set(curr_amt);

    return res
      .status(200)
      .json({ message: "Spending (transaction) saved successfully" });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/transactions", async (req, res) => {
  const { user_id } = req.query;

  try {
    const transactionsRef = db.ref(`User_Transactions/${user_id}/Transactions`);
    const snapshot = await transactionsRef.once("value");

    if (!snapshot.exists()) {
      // If no transactions yet, return an empty array
      return res.status(200).json([]);
    }

    const transactionsData = snapshot.val();
    // Convert the object of objects into an array
    // Each transaction will have an auto-generated key like "-Mxyz..."
    // We'll place that key inside each transaction object for reference
    const transactionsArray = Object.keys(transactionsData).map((key) => {
      return {
        id: key,
        ...transactionsData[key],
      };
    });

    // Optionally sort by timestamp descending
    transactionsArray.sort((a, b) => b.timestamp - a.timestamp);

    return res.status(200).json(transactionsArray);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//add get endpoint to return the user's highest spending category
//param : user_id
app.get("/max_spend_category", async (req, res) => {
  const { user_id } = req.query;

  try {
    // We'll directly retrieve the entire "Aggregated" node
    const aggregatesRef = db.ref(`User_Transactions/${user_id}/Aggregated`);
    const snapshot = await aggregatesRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ max_spending_category: null });
    }

    const aggregatedData = snapshot.val();
    // aggregatedData is something like:
    //   { Dining: 120, Travel: 70, Grocery: 180 }

    let maxCategory = "";
    let maxAmount = 0;

    for (const cat in aggregatedData) {
      if (aggregatedData[cat] > maxAmount) {
        maxAmount = aggregatedData[cat];
        maxCategory = cat;
      }
    }

    return res.status(200).json({ max_spending_category: maxCategory });
  } catch (error) {
    console.error("Error getting maximum spend category: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint to get each user's spendign per category
//param : user_id
app.get("/spending_per_category", async (req, res) => {
  //parse query
  const { user_id } = req.query;

  //reference user's database collection
  const db_user_trans_ref = "User_Transactions/" + user_id;
  const user_trans_ref = db.ref(db_user_trans_ref);

  try {
    //reference a user's collection
    const spend_categories = ["Dining", "Travel", "Grocery"];
    let spending = [];
    for (let i = 0; i < spend_categories.length; i++) {
      console.log(i);
      const curr_category = spend_categories[i];

      const db_ref = "User_Transactions/" + user_id + "/" + curr_category;

      const user_trans_ref = db.ref(db_ref);
      const snapshot = await user_trans_ref.once("value");

      if (snapshot.exists()) {
        const curr_category_amt = snapshot.val();
        spending.push(curr_category_amt);
      }
    }
    return res.status(200).json({
      Dining: spending[0],
      Travel: spending[1],
      Grocery: spending[2],
    });
  } catch (error) {
    console.error("Error getting maximum: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get up to 10 recommended cards based on user's max spend category
app.get("/spending_based_recommended_cards", async (req, res) => {
  //parse query
  const { user_id } = req.query;
  const max_category = await getMaxSpendingCategory(user_id);

  let category_id_map = new Map();
  category_id_map.set("Travel", 176638649);
  category_id_map.set("Dining", 160378660);
  category_id_map.set("Grocery", 160378660);
  //travel, dining, grocery

  const max_category_id = category_id_map.get(max_category);
  const url = `https://rewards-credit-card-api.p.rapidapi.com/creditcard-spendbonuscategory-categorycard/${max_category_id}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "rewards-credit-card-api.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();

    const eligible_cards = [];
    console.log(result);

    result.forEach((item) => {
      const ci = item.cardIssuer;
      if (
        ci == "Chase" ||
        ci == "American Express" ||
        ci == "Bank of America" ||
        ci == "Capital One" ||
        ci == "Citi"
      ) {
        const jsonObject = {
          cardName: item.cardName,
          cardIssuer: item.cardIssuer,
          spendBonusDesc: item.spendBonusDesc,
          earnMultiplier: item.earnMultiplier,
        };
        eligible_cards.push(jsonObject);
      }
    });

    //sort eligible cards and return top 3
    eligible_cards.sort((a, b) => b.earnMultiplier - a.earnMultiplier);
    let num_cards_to_return = Math.min(10, eligible_cards.length);
    const top_cards = eligible_cards.slice(0, num_cards_to_return);

    return res.status(200).json(top_cards);
  } catch (error) {
    console.error("Error Recommending Cards:", error);
  }
});

// Function to get the highest spending category
async function getMaxSpendingCategory(user_id) {
  try {
    // Define spending categories
    const spend_categories = ["Dining", "Travel", "Grocery"];

    let max_amt = 0;
    let max_category = "";

    // Loop through all categories
    for (let i = 0; i < spend_categories.length; i++) {
      const curr_category = spend_categories[i];
      const db_ref = "User_Transactions/" + user_id + "/" + curr_category;

      // Get reference to user's category in Firebase
      const user_trans_ref = db.ref(db_ref);
      const snapshot = await user_trans_ref.once("value");

      if (snapshot.exists()) {
        const curr_category_amt = snapshot.val();
        if (curr_category_amt > max_amt) {
          max_amt = curr_category_amt;
          max_category = curr_category;
        }
      }
    }

    // Return the result
    return max_category;
  } catch (error) {
    console.error("Error getting maximum spending category: ", error);
    throw new Error("Internal server error");
  }
}

//get 10 nearby businesses
app.get('/nearby_businesses', async (req, res) => {
  //parse query
  const { latitude, longitude } = req.query;
  console.log(latitude, longitude)
  includedTypes = ["gas_station", "car_wash", "car_rental", "amusement_park", "bowling_alley", "movie_theater", "restaurant", "cafe", "bakery", "bar", "diner", "deli", "fast_food_restaurant", "hotel", "inn", "motel", "lodging", "barber_shop", "hair_salon", "florist", "beauty_salon", "nail_salon", "market", "auto_parts_store", "book_store", "butcher_shop", "clothing_store", "convenience_store", "department_store",
    "electronics_store", "food_store", "furniture_store", "gift_shop", "grocery_store", "hardware_store", "home_goods_store", "home_improvement_store", "liquor_store", "market", "pet_store", "shoe_store", "sporting_goods_store",
    "store", "supermarket", "warehouse_store", "wholesaler", "gym", "bus_station", "subway_station", "train_station"]
  console.log(includedTypes.length)
  const url = `https://places.googleapis.com/v1/places:searchNearby`;
  const options = {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': process.env.PLACES_API_KEY,
      'X-Goog-FieldMask': 'places.primaryTypeDisplayName,places.displayName',
    },
    body: JSON.stringify({
      "includedTypes": includedTypes, 
      "maxResultCount": 10,
      "locationRestriction":{
        "circle": {
          "center": {
            "latitude": 33.776587,
            "longitude": -84.389539
          },
          "radius": 50.0
          }
       }
    })
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error Recommending Cards:', error);
  }
});

// app.get('/location_best_card', async (req, res) => {
//   const { user_id, businessName, categoryName } = req.query;
//   //get user's cards
//   let cards = []
//   try {
//     const db_ref = 'User_Cards/' + user_id;
//     const users_ref = db.ref(db_ref);
//     const snapshot = await users_ref.once('value');
//     if (snapshot.exists()) {
//       cards = snapshot.val();
//     }
//   } catch (error) {
//     console.error('Error accessing database:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
//   console.log(' YO', cards)
//   //for each card, /creditcard-spend-googlemaps/{cardKey}/{googleMapsBusinessName}/{googleMapsCategoryName}
//   try  {
//     Object.keys(cards).forEach((card) => {
//       console.log(card);
//       const url = `https://rewards-credit-card-api.p.rapidapi.com/creditcard-spend-googlemaps/${card}/${businessName}/${categoryName}`;
//       const options = {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//           'x-rapidapi-host': 'rewards-credit-card-api.p.rapidapi.com',
//         },
//       };
//       return res.status(200).json(cards);
//     });
//   } catch (error) {
//     console.error('Error Querying Rewards API:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
//   //return the 3 (or less if user does not have 3) cards with the highest earn rate
  
// })


exports.api = functions.https.onRequest(app)
