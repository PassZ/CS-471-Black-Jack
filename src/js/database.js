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
                    accountBalance: 0,
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
            if( !docSnap.data().accountBalance ){
                await updateDoc( docSnap.ref , {accountBalance: 0});    
            }
        }

        if( window.location.pathname === '/src/accountInformation.html'){
            const doc = docSnap.data();
            document.getElementById( "gamesPlayed" ).textContent = doc.gamesPlayed;
            document.getElementById( "gamesWon" ).textContent = doc.gamesWon;
            document.getElementById( "winRate" ).textContent =  (Math.trunc( 10000 * (doc.gamesWon / ( doc.gamesPlayed === 0 ? 1 : doc.gamesPlayed))) / 100).toString() + "%" ;
            document.getElementById( "moneyWon" ).textContent = 0;
            document.getElementById( "moneyDeposited" ).textContent = 0;
            document.getElementById( "accountBalance" ).textContent = doc.accountBalance;
            document.getElementById( "gainLossPercent" ).textContent = doc.moneyWon / doc.moneyDeposited === 0 ? 1 : doc.moneyDeposited;
            document.getElementById( "accountBalance" ).textContent = doc.accountBalance;
        }
        if( window.location.pathname === '/src/game.html' ){
            document.getElementById( "bal" ).textContent = docSnap.data().accountBalance;
        }
    }
});

const statusDiv = document.getElementById('gameResult');
if (statusDiv){
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if(statusDiv.textContent !== '' && statusDiv.textContent !== 'bet' ){
                    logGameResults();
                }
                else if( statusDiv.textContent === 'bet'){
                    subtractBet( parseInt( document.getElementById('bet').textContent));
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

async function subtractBet( val ) {
    const q = await getDocs( query( stats, where( "userID" , "==" , auth.currentUser.uid)) );
    const re = q.docs[0];
    const docSnap = q.docs[0].data();
    const newBal = docSnap.accountBalance - val;
    await updateDoc( re.ref , {
        accountBalance: newBal
    });
    document.getElementById('bal').textContent = newBal;
}

async function logGameResults() {
    const result = document.getElementById('gameResult').textContent;
    const q = await getDocs( query( stats, where( "userID" , "==" , auth.currentUser.uid)) );
    const docSnapNew = q.docs[0];
    console.log( result );
    console.log( docSnapNew.data().accountBalance );
    const bet = document.getElementById( 'bet' ).textContent;
    if(  result === 'lose' || result === "Dealer wins!"){
        await updateDoc( docSnapNew.ref , {
            gamesPlayed: increment(1),
            gamesLost: increment(1)
        });
    }
    else if( result === 'tie!'){
        await updateDoc(docSnapNew.ref , {
            gamesTied: increment(1),
            gamesPlayed: increment(1),
            accountBalance: increment( bet )
        });
        document.getElementById('bal').textContent = docSnapNew.data().accountBalance + bet;
    }
    else if (result === "Player wins!" || result === "win" ){
        await updateDoc( docSnapNew.ref , {
            gamesWon: increment(1),
            gamesPlayed: increment(1),
            accountBalance: increment( 1.5 * bet )
        });
        document.getElementById('bal').textContent = docSnapNew.data().accountBalance + 1.5 * bet;
    }
}

function addMoney() {
    document.getElementById("addMoneyDialog").style.display = "block";
}

function closeModal() {
    document.getElementById("addMoneyDialog").style.display = "none";
}

function updateBalance(amount) {
    var currentBalance = parseInt(document.getElementById("bal").textContent);
    var newBal = currentBalance + amount;
    document.getElementById("bal").textContent = newBal;
    recordNewBalance( newBal );
    closeModal();
}

function addCustomAmount() {
    var amount = parseInt(document.getElementById("customAmount").value);
    if (!isNaN(amount)) {
        updateBalance(amount);
    }
    document.getElementById('customAmount').value = '';
}

async function recordNewBalance( newBal ){
    await updateDoc( docSnap.ref , {
        accountBalance: newBal
    })
}
window.addCustomAmount = addCustomAmount;
window.addMoney = addMoney;
window.closeModal = closeModal;
window.updateBalance = updateBalance;