import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPG7W6cehOtX1daDfYZxciDudvQsv5I_A",
  authDomain: "cuidar-ja.firebaseapp.com",
  databaseURL: "https://cuidar-ja-default-rtdb.firebaseio.com",
  projectId: "cuidar-ja",
  storageBucket: "cuidar-ja.firebasestorage.app",
  messagingSenderId: "1080862226311",
  appId: "1:1080862226311:web:a7c61065fabf423eebc522",
  measurementId: "G-GPE83480KL"
};

const app = initializeApp(firebaseConfig);
const firebaseDb = getDatabase(app);

export { firebaseDb, ref };