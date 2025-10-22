/*import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'*/
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';

// Uses local storage to prevent firebase access frequently on each boot of the app , increased performance , Firebase free plan will not end soon 

import { getFirestore } from 'firebase/firestore';

// Optional if you need storage access
import { getStorage } from 'firebase/storage';


const config = {
    apiKey: "AIzaSyDmS6JVeEKn-zV66EdUWJlfcL2bQCwvzKA",
    authDomain: "bngt-3fae1.firebaseapp.com",
    projectId: "bngt-3fae1",
    storageBucket: "bngt-3fae1.appspot.com",
    messagingSenderId: "689611968604",
    appId: "1:689611968604:web:2ab804816d890fedef9699",
    measurementId: "G-CLG7TVCZ7W",
    persistence : true,
    experimentalForceLongPolling: true,
    synchronizeTabs: true
}

/*if (app.apps.length === 0) app.initializeApp(config)

app.firestore().settings({ experimentalForceLongPolling: true, merge: true});

const firestore = app.firestore()
const firestoreFunction = app.firestore
const auth = app.auth()

export default firestore
export {firestoreFunction, auth}*/

const app = initializeApp(config);

const auth = initializeAuth(app);

const firestore = getFirestore(app);

//Optional if you need storage access 
const storage = getStorage(app);


export { auth, firestore, storage };

