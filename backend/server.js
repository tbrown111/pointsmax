const express = require('express')
const db = require('./db.js')

const app = express();


//for local hosting --> remove when hosting on firebase
const PORT = 3000;

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);

app.get('/optimal_card', async (req, res) => {
    const { card, category } = req.query;

    db_ref = 'Rewards/' + card
    const rewardsRef = db.ref(db_ref);

    try {
        const snapshot = await rewardsRef.once('value');
    
        if (snapshot.exists()) {
            const rewards = snapshot.val();
            const reward_per_category = rewards[category]
            return res.status(200).json(reward_per_category);
        } else {
            return res.status(200).json({  });
        }

      } catch (error) {
        console.error('Error fetching recent searches:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

//example for  post
// app.post('/search', async (req, res) => {
//     return res.status(500).json({ error: 'Internal server error' });
// });