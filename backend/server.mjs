import express from 'express';
import db from './db.js';

const app = express();
app.use(express.json());

const PORT = 8080;

app.listen(8080, () => {
    console.log(
      'Server is running on port 8080. Check the app on http://localhost:8080'
    );
});

//feature : given a user_id and the category of purchase they make --> look through their cards and find the ones that 
//give most points
//ex query: GET https://URL/optimal_card?user_id={user_id}&category={category}
//category must be one of following : {Dining, Gas, Grocery, Other, Streaming Services, Travel}
app.get('/optimal_card', async (req, res) => {
    //parse query
    const { user_id , category } = req.query;

    //reference user's database collection
    const db_user_ref = 'Users/' + user_id;
    const user_ref = db.ref(db_user_ref);

    try {
        //get cards that user holds
        const user_snapshot = await user_ref.once('value')
        const user_cards = user_snapshot.val()
        
        let best_card = []
        let best_value = 0
        
        //for each card user has
        for (let card of Object.keys(user_cards)) {
            
            //get the card's rewards
            const db_rewards_ref = 'Rewards/' + card;
            const rewards_ref = db.ref(db_rewards_ref);
            const rewards_snapshot = await rewards_ref.once('value');
            
            if (rewards_snapshot.exists()) {
                //compare to existing best --> add or replace best as necessary
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
        //return json : arr of best cards and int of best value
        return res.status(200).json({
            best_card: best_card,
            best_value: best_value
        });
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


//feature : add a card_id to a user_id profile
//ex query: POST https://URL/add_card   JSON BODY: {"user_id":"", "card_id":""}
//card_id must be {CSP, AMEX_GOLD, DISCOVER_STUDENT, WF_AUTOGRAPH}
app.post('/add_card', async (req, res) => {
    //parse request body
    const user_id = req.body.user_id;
    const card_id = req.body.card_id;
    console.log("User_id" + user_id)
    console.log("Card_id" + card_id)

    try {
        //reference a user's collection
        const db_ref = 'Users/' + user_id;
        const users_ref = db.ref(db_ref);
        const snapshot = await users_ref.once('value')
    
        let cards = []

        if (snapshot.exists()) {
            //set cards to user's existing cards (this is a map)
            cards = snapshot.val()
            if (!cards.hasOwnProperty(card_id)) {
                //add to local cards map
                cards[String(card_id)] = '';
                //update db
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