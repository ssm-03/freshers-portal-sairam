import { auth, onAuthStateChanged, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, db,  doc, setDoc, getDocs, collection } from "/public/js/config.js";

const signInBtn = document.querySelector(".sign-in");
const errHandler = document.querySelector(".error");

// onAuthStateChanged(auth, (user) => {
//     if (user && user.uid === "nW2xockgUwdXcSpBZTOCoWSsc1h1") location.href = '/admin';
//     else if (user && user.uid !== "nW2xockgUwdXcSpBZTOCoWSsc1h1") location.href = '/portal';
// });

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loginDetails = Object.fromEntries(new FormData(e.target).entries());
    signInBtn.classList.toggle("sign-in-disabled");
    
    errHandler.innerHTML = '';

    setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, loginDetails.email+"@sairamfreshers.com", loginDetails.password).then( async (result) => {
            if (result.user.uid === "nW2xockgUwdXcSpBZTOCoWSsc1h1") location.href = '/admin';
            const docRef = doc(db, "students", auth.currentUser.email.split("@")[0]);
            const docSnaps = await getDocs(collection(db, "students"));
            // console.log(docSnaps);
            if (docSnaps.docs.some((elem) => elem.id !== email.value)){
                await setDoc(docRef, {
                    hasSet: false
                });
                location.href = '/portal'
            }
        }).catch(err => {
            console.log(err);
            if (err.code === "auth/wrong-password"){
                errHandler.innerHTML = "Wrong Password";
                signInBtn.classList.toggle("sign-in-disabled");
            }else if(err.code === "auth/too-many-requests"){
                errHandler.innerHTML = "Too many invalid attempts. Contact admin or try later";
                signInBtn.classList.toggle("sign-in-disabled");
            }else if(err.code === "auth/user-not-found"){
                errHandler.innerHTML = "Invalid username";
                signInBtn.classList.toggle("sign-in-disabled");
            }else{
                errHandler.innerHTML = "Unknown error. Try again later.";
                signInBtn.classList.toggle("sign-in-disabled");
            }
        });
    }).catch(() => {
        location.href = '/';
    })
    
}

document.querySelector("form").addEventListener("submit", handleSubmit);