const form = document.getElementById('comment');
// adding data to db
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('comment').add({
        name: form.name.value,
        comment: form.comment.value
    });
    form.name.value = '';
    form.comment.value = '';
});

// reading from db
const div = document.querySelector('.cont');

renderList = () =>{
    var main_div = document
}

db.collection('comment').onSnapshot(snap => {
    let changes = snap.docChanges();
    changes.forEach(change => {
        if (change.type == 'added'){
            console.log(change.doc.data());
        }
    });
});