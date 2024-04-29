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
        console.log( c );
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
    }
});

const statusDiv = document.getElementById('status');
if (statusDiv){
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if(statusDiv.textContent !== 'Choose your action!'){
                    console.log( statusDiv );
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
    if( result === 'Player Busts!' || result === 'Dealer wins, player busts!' || 'Dealer wins!'){
        // console.log( docSnap.data() );
        db.collection( "UserStats" ).where( "userID" , "==" , auth.currentUser.uid ).limit(1).get().then( query => {
            console.log( query );
            const data = query.docs[0];
            console.log( data.data() );
            const tmp = data.data();
            tmp.gamesLost = tmp.gamesLost + 1;
            tmp.gamesPlayed = tmp.gamesPlayed + 1;
            console.log( tmp );
            data.ref.update( tmp );
        })
        // console.log( doc(db , "UserStats" , auth.currentUser.uid));
        // console.log( docSnap.data() );
        // const data = docSnap.data();
        // data.gamesPlayed = data.gamesPlayed + 1;
        // data.gamesLost = data.gamesLost + 1;
        // docSnap.ref.update( data );
        
    }
    else {
        dosSnap.update({
            gamesWon: docSnap.gamesWon + 1,
            gamesPlayed: docSnap.gamesPlayed +1
        });
    }
}
