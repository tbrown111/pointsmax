import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const statusEl = document.getElementById("status");
  const cardList = document.getElementById("cardList");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      statusEl.textContent = `✅ Signed in as ${user.email}`;
      console.log(user.uid)
      await fetchUserCards(user.uid);
    } else {
      statusEl.textContent = "Not signed in";
    }
  });

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const pw = document.getElementById("password").value;
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pw);
      statusEl.textContent = `✅ Welcome, ${userCred.user.email}`;
      console.log(userCred.user.uid);
      await fetchUserCards(userCred.user.uid);
    } catch (err) {
      statusEl.textContent = `❌ ${err.message}`;
    }
  });

  
  async function fetchUserCards(userId) {
    try {
      const res = await fetch(`https://api-zto2acvx6a-uc.a.run.app/user_cards?user_id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch credit cards");
  
      const cards = await res.json(); // array of card names/ids
      cardList.innerHTML = "";
  
      // Now get website and call OpenAI
      getCurrentTabDomain(async (domain) => {
        const bestCard = await getBestCard(cards, domain);
        const resultLi = document.createElement("li");
        resultLi.textContent = `⭐ Best card for ${domain}: ${bestCard}`;
        cardList.appendChild(resultLi);
      });
    } catch (err) {
      statusEl.textContent = `⚠️ ${err.message}`;
    }
  }
  async function getBestCard(cards, website) {
    console.log('prompted')
    console.log(cards)
    const prompt = `You are a helpful assistant that picks the best credit card based on rewards or perks. Here are the user's cards: ${cards.join(
      ", "
    )}. Which card is best to use on ${website}? Respond with just the name of the card.`;
  
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ``,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
      }),
    });
  
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }
  function getCurrentTabDomain(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      callback(url.hostname);
    });
  }
});