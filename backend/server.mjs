// server.mjs (Node.js/Express Server)
import express from 'express';
import db from './db.js';

const app = express();
app.use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. Check the app on http://localhost:${PORT}`);
});

// Feature: Given a user_id and the category of purchase they make --> look through their cards and find the ones that give most points
// Example query: GET https://URL/optimal_card?user_id={user_id}&category={category}
// Category must be one of the following: {Dining, Gas, Grocery, Other, Streaming Services, Travel}
app.get('/optimal_card', async (req, res) => {
    // Parse query
    const { user_id, category } = req.query;

    // Reference user's database collection
    const db_user_ref = 'Users/' + user_id;
    const user_ref = db.ref(db_user_ref);

    try {
        // Get cards that user holds
        const user_snapshot = await user_ref.once('value');
        const user_cards = user_snapshot.val();

        let best_card = [];
        let best_value = 0;

        // For each card user has
        if (user_cards) {
            for (let card of Object.keys(user_cards)) {
                // Get the card's rewards
                const db_rewards_ref = 'Rewards/' + card;
                const rewards_ref = db.ref(db_rewards_ref);
                const rewards_snapshot = await rewards_ref.once('value');

                if (rewards_snapshot.exists()) {
                    // Compare to existing best --> add or replace best as necessary
                    const rewards = rewards_snapshot.val();
                    const reward_per_category = rewards[category];
                    if (reward_per_category > best_value) {
                        best_card = [card];
                        best_value = reward_per_category;
                    } else if (reward_per_category == best_value) {
                        best_card.push(card);
                    }
                }
            }
        }

        // Return JSON: array of best cards and integer of best value
        return res.status(200).json({
            best_card: best_card,
            best_value: best_value,
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Feature: Add a card_id to a user_id profile
// Example query: POST https://URL/add_card  JSON BODY: {"user_id":"", "card_id":""}
// card_id must be {CSP, AMEX_GOLD, DISCOVER_STUDENT, WF_AUTOGRAPH}
app.post('/add_card', async (req, res) => {
    // Parse request body
    const user_id = req.body.user_id;
    const card_id = req.body.card_id;
    console.log("User_id" + user_id);
    console.log("Card_id" + card_id);

    try {
        // Reference a user's collection
        const db_ref = 'Users/' + user_id;
        const users_ref = db.ref(db_ref);
        const snapshot = await users_ref.once('value');

        let cards = [];

        if (snapshot.exists()) {
            // Set cards to user's existing cards (this is a map)
            cards = snapshot.val();
            if (!cards.hasOwnProperty(card_id)) {
                // Add to local cards map
                cards[String(card_id)] = '';
                // Update db
                await users_ref.set(cards);
                return res.status(200).json({ message: `Key '${card_id}' added successfully!`, cards });
            } else {
                return res.status(200).json({ message: `${card_id} already exists in the database.`, cards });
            }
        }
    } catch (error) {
        console.error('Error updating database:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Feature: Add spending to a user's transactions
app.post('/add_spending', async (req, res) => {
    const { user_id, spend_category, amount } = req.body;

    console.log("Received POST request to /add_spending");
    console.log("Request body:", req.body);

    if (!user_id || !spend_category || amount == null) {
        console.error("Missing fields in request body");
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const timestamp = Date.now();
        const db_ref = db.ref(`User_Transactions/${user_id}/${timestamp}`);

        await db_ref.set({
            category: spend_category,
            amount: amount,
        });

        console.log("Spending added successfully to database");
        return res.status(200).json({ message: 'Spending added successfully!' });
    } catch (error) {
        console.error('Error adding spending:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/user_transactions', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  
    try {
      const snapshot = await db.ref(`User_Transactions/${user_id}`).once('value');
      const data = snapshot.val();
      return res.status(200).json(data || {});
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});