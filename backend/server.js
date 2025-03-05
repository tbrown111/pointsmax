const express = require('express')

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

app.get('/test', (req, res) => {
    res.json({ value: 'Test' });
});

//example for  post
// app.post('/search', async (req, res) => {
//     return res.status(500).json({ error: 'Internal server error' });
// });