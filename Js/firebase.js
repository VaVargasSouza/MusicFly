import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAJBTSmK-kvXkyitrCVq4quvHk9E9tw_gQ",
  authDomain: "musicfly-949b2.firebaseapp.com",
  projectId: "musicfly-949b2",
  storageBucket: "musicfly-949b2.firebasestorage.app",
  messagingSenderId: "463262441664",
  appId: "1:463262441664:web:f795ef5dda2324d9c54d25",
  measurementId: "G-1R7MZ1SF9N"
};

const app = initializeApp(firebaseConfig);

export { app };