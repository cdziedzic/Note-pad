const express = require('express');
const path = require('path');
const notes = require('./db/db.json')
const fs = require('fs')
const app = express();
const PORT = 3001;
const notesFilePath = path.join(__dirname, './db/db.json');

class Note {
    constructor(title, text, uuid){
    this.title  = title
    this.text = text
    this.uuid = uuid
}}

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
    const newNote = new Note (`${req.body.title}`, `${req.body.text}`, `uuid`)
    if (!Array.isArray(notes))
        notes = [];
      notes.push(newNote)
    fs.writeFileSync(notesFilePath, JSON.stringify(notes))
  }
   
    createNewNote()
    getNotes()
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
