import { getFirestore, collection, doc, setDoc, query, where , addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'; 
import { onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { app , auth} from './firebase.js'

const db = getFirestore(app);
const stats = collection(db, "UserStats");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const q = query(stats, where( "userID" , "==", auth.currentUser.uid));
        const querySnapshot = await getDocs( q );
        const c = querySnapshot.size;
        console.log( c );
        if( c === 0 ){
        
            try {
                const docRef = await addDoc(collection(db , "UserStats"), {
                    gamesLost: 0,
                    gamesPlayed: 0,
                    gamesTied: 0,
                    gamesWon: 0,
                    moneyDeposited: 0,
                    moneyWon: 0,
                    moneyLost: 0,
                    userID: auth.currentUser.uid,
                });
                console.log("Document written with ID: ", docRef.id);
              } catch (e) {
                console.error("Error adding document: ", e);
                console.log( request.auth );
            
              }
        
        }
    }
});


const statusDiv = document.getElementById('status');
const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
            if(statusDiv.textContent !== 'Choose your action!'){
                console.log( mutation.type );
                logGameResults();
            }
        }
    }
});

const config = {
    childList: true, 
    subtree: true,   
    characterData: true 
};
observer.observe(statusDiv, config);

function logGameResults() {
    console.log( document.getElementById('status') );
    const result = document.getElementById('status').textContent;
    if( result === 'Player Busts!' || result === 'Dealer wins, player busts!' || 'Dealer wins!'){

    }
}




function test(){
    console.log( auth.currentUser.uid );

}


function recordStats( status ) {
    console.log( status );
}

window.recordStats = recordStats;
window.test = test;