const express = require('express');
const path = require('path');
const notes = require('./db/db.json')
const fs = require('fs')
const app = express();
const PORT = 3001;
const notesFilePath = path.join(__dirname, './db/db.json');
const { v4: uuidv4 } = require('uuid');
const newUUID = uuidv4()


app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    return res.json(notes)
});


app.post('/api/notes', (req, res) => {
  
  function createNewNote() {
    const newNote = {
      title: `${req.body.title}`, 
      text:  `${req.body.text}`, 
      id: `${newUUID}`}
    if (!Array.isArray(notes))
        notes = [];
      notes.push(newNote)
    fs.writeFileSync(notesFilePath, JSON.stringify(notes))
  }
   
    createNewNote()
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.delete('/api/notes/:id', (req, res) => {
  function deleteNote() {
  let noteId = req.params.id
  let noteIndex;
 for (let i = 0; i < notes.length; i++) {
  console.log(notes[i].id);
  if (notes[i].id === noteId) {
    noteIndex = [i]
  }

  notes.splice(noteIndex, 1)
    fs.writeFileSync(notesFilePath, JSON.stringify(notes))
}
  }
  
 
deleteNote()
res.sendFile(path.join(__dirname, '/public/notes.html'))
})


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
