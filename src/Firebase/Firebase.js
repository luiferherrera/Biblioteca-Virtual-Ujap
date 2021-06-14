import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCJA90FjnVnXAMzBihbsp1fgF2YjBZZJDc",
    authDomain: "biblioteca-virtual-ujap.firebaseapp.com",
    projectId: "biblioteca-virtual-ujap",
    storageBucket: "biblioteca-virtual-ujap.appspot.com",
    messagingSenderId: "681705610395",
    appId: "1:681705610395:web:3ed3181f26ccc59ca97a3e",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.firestore(firebaseApp);

export default firebaseApp;