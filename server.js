const express = require('express');
const path = require('path');
const notes = require('./db/db.json')
const fs = require('fs')
const app = express();
const PORT = process.env.PORT || 3001;
const notesFilePath = path.join(__dirname, './db/db.json');
const { v4: uuidv4 } = require('uuid');
const newUUID = uuidv4()


app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//show index on start
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);
//notes list page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
//saved note file
app.get('/api/notes', (req, res) => {
    return res.json(notes)
});

//post to notes in db.json
app.post('/api/notes', (req, res) => {
  
  function createNewNote() {
    const newNote = {
      title: `${req.body.title}`, 
      text:  `${req.body.text}`, 
      id: `${newUUID}`}
    //check if notes array exists, if not create empty array
      if (!Array.isArray(notes))
        notes = [];
      //push new note to array and write to db.json file
        notes.push(newNote)
    fs.writeFileSync(notesFilePath, JSON.stringify(notes))
  }
   
    createNewNote()
    //redisplay the page to update the list
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});
//delete the note based upon its id
app.delete('/api/notes/:id', (req, res) => {
  function deleteNote() {
  let noteId = req.params.id
  let noteIndex;
 
 //check to make sure note matches one to be deleted
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === noteId) {
    console.log(notes[i].id === noteId)
      noteIndex = notes[i].id
     
 
  }
//remove note from file based upon index value
notes.splice(noteIndex, 1)
fs.writeFileSync(notesFilePath, JSON.stringify(notes))
}
  }
  
 
deleteNote()
res.sendFile(path.join(__dirname, '/public/notes.html'))
})

//take user to index page if none of above is triggered
app.get('*', (req, res)=> {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () =>
  console.log(`app listening at port:${PORT}`)
);
