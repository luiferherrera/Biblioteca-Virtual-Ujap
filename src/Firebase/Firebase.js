/**Crear e iniciar entorno de firebase y la base de datos firestore con las credenciales del proyecto */

// Librerias de firebase
import firebase from 'firebase/app'
import 'firebase/firestore'

// Credenciales del proyecto de firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJA90FjnVnXAMzBihbsp1fgF2YjBZZJDc",
    authDomain: "biblioteca-virtual-ujap.firebaseapp.com",
    projectId: "biblioteca-virtual-ujap",
    storageBucket: "biblioteca-virtual-ujap.appspot.com",
    messagingSenderId: "681705610395",
    appId: "1:681705610395:web:3ed3181f26ccc59ca97a3e",
};

// Iniciar firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// Iniciar firestore (Base de datos)
firebase.firestore(firebaseApp);

// Exportar
export default firebaseApp;