window.onload = function () {
    const firebaseConfig = {
        apiKey: "AIzaSyCr4mBPUSyK52hJLfUiFAWb_4RPMIlVv3s",
        authDomain: "love-comments.firebaseapp.com",
        projectId: "love-comments",
        storageBucket: "love-comments.firebasestorage.app",
        messagingSenderId: "835601908494",
        appId: "1:835601908494:web:9a9386fa19dba5e44b8d5f"
    };

    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("Firebase Initialized Successfully!");

    document.getElementById("comment-form").addEventListener("submit", function(event) {
        event.preventDefault();

        let name = document.getElementById("name").value.trim();
        let comment = document.getElementById("comment").value.trim();

        if (name.length < 2 || comment.length < 5) {
            alert("Name must be at least 2 characters and comment at least 5 characters.");
            return;
        }

        function sanitizeInput(str) {
            return str.replace(/[&<>'"/]/g, function(tag) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;',
                    '/': '&#x2F;'
                }[tag] || tag;
            });
        }

        let safeName = sanitizeInput(name);
        let safeComment = sanitizeInput(comment);

        db.collection("comments").add({
            name: safeName,
            comment: safeComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            displayComments();
            document.getElementById("comment-form").reset();
        });
    });

    function displayComments() {
        let commentsContainer = document.getElementById("comments-container");
        commentsContainer.innerHTML = "";
        db.collection("comments").orderBy("timestamp", "desc").get().then(snapshot => {
            snapshot.forEach(doc => {
                let commentData = doc.data();
                let commentElement = document.createElement("div");
                commentElement.classList.add("comment");
                commentElement.innerHTML = `<strong>${commentData.name}:</strong> <p>${commentData.comment}</p>`;
                commentsContainer.appendChild(commentElement);
            });
        });
    }

    document.addEventListener("DOMContentLoaded", displayComments);
};
