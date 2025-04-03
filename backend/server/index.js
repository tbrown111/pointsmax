express = require('express');
db = require('./db/db.js');
dotenv = require('dotenv');
functions = require('firebase-functions')


const app = express();
app.use(express.json());

dotenv.config()

//for local hosting
const PORT = 3000;

//for remote hosting
app.listen(3000, () => {
  console.log(
    'Server is running on port 8080. Check the app on http://localhost:8080'
  );
});

app.get('/optimal_card', async (req, res) => {
  const { user_id, category } = req.query;

  const db_user_ref = 'Users/' + user_id;
  const user_ref = db.ref(db_user_ref);

  try {
    const user_snapshot = await user_ref.once('value');
    const user_cards = user_snapshot.val();

    let best_card = [];
    let best_value = 0;
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
          best_card.push(card);
        }
      }
    }
    return res.status(200).json({
      best_card: best_card,
      best_value: best_value,
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
  console.log(user_id);
  console.log(card_id);
  try {
    const db_ref = 'Users/' + user_id;
    const users_ref = db.ref(db_ref);
    const snapshot = await users_ref.once('value');
    let cards = [];
    console.log(snapshot.val());
    if (snapshot.exists()) {
      cards = snapshot.val();
      if (!cards.hasOwnProperty(card_id)) {
        cards[String(card_id)] = '';
        await users_ref.set(cards);
        return res
          .status(200)
          .json({ message: `Key '${card_id}' added successfully!`, cards });
      } else {
        return res.status(200).json({
          message: `${card_id} already exists in the database.`,
          cards,
        });
      }
    }
  } catch (error) {
    console.error('Error updating database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//to be called when a user is registered
app.post('/initialize_spending', async (req, res) => {
  //parse request body
  const user_id = req.body.user_id;

  try {
    const db_ref = 'User_Transactions/' + user_id;
    const user_transactions_ref = db.ref(db_ref);

    await user_transactions_ref.set({ Dining: 0, Travel: 0, Grocery: 0 });
    return res.status(200).json({ message: `User spending initialized in db` });
  } catch (error) {
    console.error('Error updating database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add_spending', async (req, res) => {
  //parse request body
  const user_id = req.body.user_id;
  const spend_category = req.body.spend_category; //travel, dining, grocery
  const amt = req.body.amt;

  try {
    //reference a user's collection
    const db_ref = 'User_Transactions/' + user_id + '/' + spend_category;
    const user_transactions_ref = db.ref(db_ref);
    const snapshot = await user_transactions_ref.once('value');

    let curr_amt = 0;

    if (snapshot.exists()) {
      //set cards to user's existing cards (this is a map)
      curr_amt = snapshot.val();
      curr_amt += amt;
      await user_transactions_ref.set(curr_amt);
      return res.status(200).json({ message: `Spending updated successfully` });
    }
  } catch (error) {
    console.error('Error updating database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//add get endpoint to return the user's highest spending category
//param : user_id
app.get('/max_spend_category', async (req, res) => {
  //parse query
  const { user_id } = req.query;

  //reference user's database collection
  const db_user_trans_ref = 'User_Transactions/' + user_id;
  const user_trans_ref = db.ref(db_user_trans_ref);

  try {
    //reference a user's collection
    const spend_categories = ['Dining', 'Travel', 'Grocery'];
    let max_amt = 0;
    let max_category = '';
    for (let i = 0; i < spend_categories.length; i++) {
      console.log(i);
      const curr_category = spend_categories[i];

      const db_ref = 'User_Transactions/' + user_id + '/' + curr_category;

      const user_trans_ref = db.ref(db_ref);
      const snapshot = await user_trans_ref.once('value');

      if (snapshot.exists()) {
        const curr_category_amt = snapshot.val();
        console.log(curr_category, curr_category_amt);
        if (curr_category_amt > max_amt) {
          max_amt = curr_category_amt;
          max_category = curr_category;
        }
      }
    }
    return res.status(200).json({
      max_spending_category: max_category,
    });
  } catch (error) {
    console.error('Error getting maximum: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//endpoint to get each user's spendign per category
//param : user_id
app.get('/spending_per_category', async (req, res) => {
  //parse query
  const { user_id } = req.query;

  //reference user's database collection
  const db_user_trans_ref = 'User_Transactions/' + user_id;
  const user_trans_ref = db.ref(db_user_trans_ref);

  try {
    //reference a user's collection
    const spend_categories = ['Dining', 'Travel', 'Grocery'];
    let spending = [];
    for (let i = 0; i < spend_categories.length; i++) {
      console.log(i);
      const curr_category = spend_categories[i];

      const db_ref = 'User_Transactions/' + user_id + '/' + curr_category;

      const user_trans_ref = db.ref(db_ref);
      const snapshot = await user_trans_ref.once('value');

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
    console.error('Error getting maximum: ', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//get up to 10 recommended cards based on user's max spend category
app.get('/spending_based_recommended_cards', async (req, res) => {
  //parse query
  const { user_id } = req.query;
  const max_category = await getMaxSpendingCategory(user_id);

  let category_id_map = new Map();
  category_id_map.set('Travel', 176638649);
  category_id_map.set('Dining', 160378660);
  category_id_map.set('Grocery', 160378660);
  //travel, dining, grocery

  const max_category_id = category_id_map.get(max_category);
  const url = `https://rewards-credit-card-api.p.rapidapi.com/creditcard-spendbonuscategory-categorycard/${max_category_id}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'rewards-credit-card-api.p.rapidapi.com',
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
        ci == 'Chase' ||
        ci == 'American Express' ||
        ci == 'Bank of America' ||
        ci == 'Capital One' ||
        ci == 'Citi'
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
    console.error('Error Recommending Cards:', error);
  }
});

// Function to get the highest spending category
async function getMaxSpendingCategory(user_id) {
  try {
    // Define spending categories
    const spend_categories = ['Dining', 'Travel', 'Grocery'];

    let max_amt = 0;
    let max_category = '';

    // Loop through all categories
    for (let i = 0; i < spend_categories.length; i++) {
      const curr_category = spend_categories[i];
      const db_ref = 'User_Transactions/' + user_id + '/' + curr_category;

      // Get reference to user's category in Firebase
      const user_trans_ref = db.ref(db_ref);
      const snapshot = await user_trans_ref.once('value');

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
    console.error('Error getting maximum spending category: ', error);
    throw new Error('Internal server error');
  }
}

exports.api = functions.https.onRequest(app)
