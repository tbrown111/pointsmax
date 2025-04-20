// services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// If you need analytics on web, you can import it. For mobile, it might not be needed.
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "",
  authDomain: "pointsmax-cad35.firebaseapp.com",
  databaseURL: "https://pointsmax-cad35-default-rtdb.firebaseio.com",
  projectId: "pointsmax-cad35",
  storageBucket: "pointsmax-cad35.firebasestorage.app",
  messagingSenderId: "223525118521",
  appId: "1:223525118521:web:cd774a8d0db818a199a3e8",
  measurementId: "G-MFM9CHNXX1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Optionally, if you're building for the web and need analytics:
// const analytics = getAnalytics(app);

export { auth };
