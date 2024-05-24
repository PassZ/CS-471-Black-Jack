import { getFirestore, collection, doc, setDoc, query, where , addDoc, getDocs , updateDoc , increment} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js'; 
import { onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { app , auth} from './firebase.js'

let db = getFirestore(app);
const stats = collection(db, "UserStats");
let docSnap = null;


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const q = query(stats, where( "userID" , "==", auth.currentUser.uid));
        docSnap = await getDocs( q );
        const c = docSnap.size;
        if( c === 0 ){        
            try {
                docSnap = await addDoc(collection(db , "UserStats"), {
                    gamesLost: 0,
                    gamesPlayed: 0,
                    gamesTied: 0,
                    gamesWon: 0,
                    moneyDeposited: 0,
                    moneyWon: 0,
                    moneyLost: 0,
                    userID: auth.currentUser.uid,
                });
            } catch (e) {
                console.error("Error adding document: ", e);            
            }
        }
        else{
            docSnap = docSnap.docs[0];
        }

        if( window.location.pathname === '/src/accountInformation.html'){
            const doc = docSnap.data();
            document.getElementById( "gamesPlayed" ).textContent = doc.gamesPlayed;
            document.getElementById( "gamesWon" ).textContent = doc.gamesWon;
            document.getElementById( "winRate" ).textContent =  (Math.trunc( 10000 * (doc.gamesWon / ( doc.gamesPlayed === 0 ? 1 : doc.gamesPlayed))) / 100).toString() + "%" ;
            document.getElementById( "moneyWon" ).textContent = 0;
            document.getElementById( "moneyDeposited" ).textContent = 0;
            document.getElementById( "accountBalance" ).textContent = 0;
            document.getElementById( "gainLossPercent" ).textContent = 0;
        }
    }
});

const statusDiv = document.getElementById('status');
if (statusDiv){
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if(statusDiv.textContent !== 'Choose your action!' && statusDiv.textContent !== 'Auto-stand on hard 17 or higher'){
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
}


async function logGameResults() {
    const result = document.getElementById('status').textContent;
    console.log( result );
    if(  result === "Dealer wins, player busts!" || result === "Dealer wins!"){
        await updateDoc( docSnap.ref , {
            gamesPlayed: increment(1),
            gamesLost: increment(1)
        });       
    }
    else if( result === 'Draw!'){
        await updateDoc(docSnap.ref , {
            gamesTied: increment(1),
            gamesPlayed: increment(1)
        });
    }
    else if (result === "Player wins!" || result === "Player wins, dealer busts!" ){
        await updateDoc( docSnap.ref , {
            gamesWon: increment(1),
            gamesPlayed: increment(1)
        })
    }
}