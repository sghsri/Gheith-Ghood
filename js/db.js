// Initialize Firebase
const config = {
    apiKey: "",
    authDomain: "gheithgood.firebaseapp.com",
    databaseURL: "https://gheithgood.firebaseio.com",
    projectId: "gheithgood",
    storageBucket: "gheithgood.appspot.com",
    messagingSenderId: "420650821813"
};
firebase.initializeApp(config);

const db = firebase.firestore();

// We keep track of the number of people on the site, so we can display how many people are currently viewing it
function updateNumUsers(num, callback) {
    const countRef = db.collection("extension_metadata").doc("live_user_count");
    countRef.get().then((dbItem) => {
        let numUsers = parseInt(dbItem.data().count);
        callback(numUsers + num);
        countRef.set({
            count: numUsers + num
        }, {
            merge: true
        });
    });
}

// This function will listen for any new chrome messages, as that is how the content scripts will communicate with this one
// The request will look like this: {type: "<name_of_function>", args: {}} where there may or may not be args
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    // We handle the different types of messages
    if (request.type === 'incrementCounter') {
        updateNumUsers(1, callback);
    } else if (request.type === 'decrementCounter') {
        updateNumUsers(-1, callback);
    }

    // We return true because we're sending our response asynchronously, so we don't want the function to timeout
    return true;
});