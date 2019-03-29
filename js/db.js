// Initialize Firebase
const config = {
    apiKey: "",
    authDomain: "gheith-633da.firebaseapp.com",
    databaseURL: "https://gheith-633da.firebaseio.com",
    projectId: "gheith-633da",
    storageBucket: "gheith-633da.appspot.com",
    messagingSenderId: "97728470514"
};
firebase.initializeApp(config);

const db = firebase.database();

// We keep track of the number of people on the site, so we can display how many people are currently viewing it
// function updateNumUsers(num, callback) {
//     const countRef = db.collection("extension_metadata").doc("live_user_count");
//     countRef.get().then((dbItem) => {
//         let numUsers = parseInt(dbItem.data().count);
//         callback(numUsers + num);
//         countRef.set({
//             count: numUsers + num
//         }, {
//             merge: true
//         });
//     });
// }

// This function will listen for any new chrome messages, as that is how the content scripts will communicate with this one
// The request will look like this: {type: "<name_of_function>", args: {}} where there may or may not be args
chrome.runtime.onMessage.addListener((request, sender, callback) => {
    // We handle the different types of messages
    // console.log(request);
    switch (request.type) {
        case 'getTestData':
            getTestData(request.project, request.test);
            break;
        case 'vote':
            vote(request.project, request.test, callback);
            break;
        default:
            break;
    }

    // We return true because we're sending our response asynchronously, so we don't want the function to timeout
    return true;
});
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.storage.sync.get('votedTests', function (data) {
            if (!data.votedTests) {
                chrome.storage.sync.set({
                    votedTests: {}
                }, function () {
                    console.log('initialized votedTests ');
                })
            }
        });
    }
});

// vote('cs439_sp19_p6', 'cceff', '++');
// vote('cs439_sp19_p6', 'ccff', '++');


function getTestData(project, test) {
    let path = `/TestData/${project}/`;
    db.ref(path + '/' + test).once('value').then(function (snap) {
        console.log(snap.val());
    });
}

function vote(project, test) {
    let path = `/TestData/${project}`;
    updateFirebaseVote(path, project, test);
    // getTestData(project, test);
    // chrome.storage.sync.get('votedTests', function(data) {
    //     var vTests = data.votedTests;
    //     console.log()
    //     if (!vTests[project]) {
    //         updateFirebaseVote(path, project, test, action);
    //         if (!vTests[project]) {
    //             vTests[project] = {};
    //         }
    //         (vTests[project])[test] = {
    //             action: action
    //         }
    //         chrome.storage.sync.set({
    //             votedTests: vTests
    //         });
    //         // console.log(vTests);
    //         chrome.storage.sync.get('votedTests', function(data) {
    //             data.votedTests;
    //         });
    //     }
    // });
    //SAVE IN CHROME SYNC STORAGE THAT YOU'VE ALREADY UPVOTED/DOWNVOTED
}


function updateFirebaseVote(path, project, test) {
    db.ref(path).transaction(function (project) {
        if (!project) {
            project = {};
        }
        if (!project[test]) {
            project[test] = {
                flag: 1
            }
        } else {
            project[test].flag++;
        }
        return project;
    }).then(function () {
        return db.ref(path + '/' + test).once('value');
    }).then(function (snap) {
        console.log(snap.val());
    });
}