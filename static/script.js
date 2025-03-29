async function fetchNotes() {
    const response = await fetch('/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note';
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="editNote(${note.id})">Редактировать</button>
            <button onclick="deleteNote(${note.id})">Удалить</button>
        `;
        notesList.appendChild(div);
    });
}

function showPopup(id = null) {
    document.getElementById('popup').style.display = 'flex';
    if (id) {
        fetch(`/notes/${id}`).then(res => res.json()).then(note => {
            document.getElementById('popup-title').textContent = 'Редактировать заметку';
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            document.getElementById('popup').dataset.id = id;
        });
    } else {
        document.getElementById('popup-title').textContent = 'Новая заметка';
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        delete document.getElementById('popup').dataset.id;
    }
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

async function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const id = document.getElementById('popup').dataset.id;

    if (id) {
        await fetch(`/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
    } else {
        await fetch('/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });
    }
    hidePopup();
    fetchNotes();
}

async function editNote(id) {
    showPopup(id);
}

async function deleteNote(id) {
    await fetch(`/notes/${id}`, { method: 'DELETE' });
    fetchNotes();
}

// Загрузка заметок при старте
fetchNotes();