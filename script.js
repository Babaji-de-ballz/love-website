window.onload = function () {
    const firebaseConfig = {
        apiKey: "AIzaSyCr4mBPUSyK52hJLfUiFAWb_4RPMIlVv3s",
        authDomain: "love-comments.firebaseapp.com",
        projectId: "love-comments",
        storageBucket: "love-comments.firebasestorage.app",
        messagingSenderId: "835601908494",
        appId: "1:835601908494:web:9a9386fa19dba5e44b8d5f"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("Firebase Initialized Successfully!");

    // Comment Submission Handler
    document.getElementById("comment-form").addEventListener("submit", function(event) {
        event.preventDefault();

        // Get input values
        let name = document.getElementById("name").value.trim();
        let gradeSection = document.getElementById("grade-section").value.trim();
        let strand = document.getElementById("strand").value.trim();
        let comment = document.getElementById("comment").value.trim();

        // Validation
        if (name.length < 2 || comment.length < 5) {
            alert("Name must be at least 2 characters and comment at least 5 characters.");
            return;
        }

        // Sanitization function
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

        // Sanitize inputs
        let safeName = sanitizeInput(name);
        let safeGradeSection = sanitizeInput(gradeSection);
        let safeStrand = sanitizeInput(strand);
        let safeComment = sanitizeInput(comment);

        // Add to Firestore
        db.collection("comments").add({
            name: safeName,
            gradeSection: safeGradeSection,
            strand: safeStrand,
            comment: safeComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            displayComments();
            document.getElementById("comment-form").reset();
        }).catch(error => {
            console.error("Error adding comment: ", error);
        });
    });

    // Display Comments
    function displayComments() {
        let commentsContainer = document.getElementById("comments-container");
        commentsContainer.innerHTML = "";
        db.collection("comments").orderBy("timestamp", "desc").get().then(snapshot => {
            snapshot.forEach(doc => {
                let commentData = doc.data();
                let commentElement = document.createElement("div");
                commentElement.classList.add("comment");
                commentElement.innerHTML = `<strong>${commentData.name}:</strong> 
                                          <p>${commentData.comment}</p>
                                          <small>${commentData.gradeSection} - ${commentData.strand}</small>`;
                commentsContainer.appendChild(commentElement);
            });
        }).catch(error => {
            console.error("Error loading comments: ", error);
        });
    }

    // Initial load of comments
    document.addEventListener("DOMContentLoaded", displayComments);
};