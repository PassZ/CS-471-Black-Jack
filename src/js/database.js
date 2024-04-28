import { getFirestore, collection, doc, setDoc, query, where , addDoc} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'; 
import { app } from './firebase.js'

const db = getFirestore(app);

try {
    const docRef = await addDoc(collection(db, "UserStats"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

function recordStats( status ) {
    console.log( status );
}

window.recordStats = recordStats;