import express from 'express';
import db from './db.js';

const app = express();
app.use(express.json());


//for local hosting
const PORT = 8080;

//for remote hosting
app.listen(8080, () => {
    console.log(
      'Server is running on port 8080. Check the app on http://localhost:8080'
    );
});
  

app.get('/optimal_card', async (req, res) => {
    const { user_id , category } = req.query;

    const db_user_ref = 'Users/' + user_id;
    const user_ref = db.ref(db_user_ref);

    try {
        const user_snapshot = await user_ref.once('value')
        const user_cards = user_snapshot.val()
        
        let best_card = []
        let best_value = 0
        for (let card of Object.keys(user_cards)) {
            const db_rewards_ref = 'Rewards/' + card;
            const rewards_ref = db.ref(db_rewards_ref);
            const rewards_snapshot = await rewards_ref.once('value');
            if (rewards_snapshot.exists()) {
                const rewards = rewards_snapshot.val();
                const reward_per_category = rewards[category];
                if (reward_per_category > best_value) {
                    best_card = [card];
                    best_value = reward_per_category;
                } else if (reward_per_category == best_value) {
                    best_card.push(card)
                }
            }
        }
        return res.status(200).json({
            best_card: best_card,
            best_value: best_value
        });
        

      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//example for  post
app.post('/add_card', async (req, res) => {
    const user_id = req.body.user_id;
    const card_id = req.body.card_id;
    console.log(user_id)
    console.log(card_id)
    try {
        const db_ref = 'Users/' + user_id;
        const users_ref = db.ref(db_ref);
        const snapshot = await users_ref.once('value')
        let cards = []
        console.log(snapshot.val())
        if (snapshot.exists()) {
            cards = snapshot.val()
            if (!cards.hasOwnProperty(card_id)) {
                cards[String(card_id)] = '';
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