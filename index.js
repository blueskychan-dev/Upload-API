const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
 
const app = express();
app.use(fileUpload());
 
app.get('/', (req, res) => {
    res.status(403).end("ERROR: Root location been not allowed!")
});
  
app.get('/uploadapi', (req, res) => {
    res.status(403).end("ERROR: GET Packet been not allowed!")
});
app.get('/files/*:tagId', function(req, res) {
    var path = req.originalUrl.substring(6);
    if(fs.existsSync(__dirname + '/uploads/' + path)) {
        res.sendFile(__dirname + '/uploads/' + path)
    }
    else{
        res.status(404).send("File in database been not found!");
    }
});
app.post('/uploadapi', (req, res) => {
    if (req.files) {
        // console.log(req.files);
        let file = req.files.file;
        let filename = file.name;
 
        // checking file size.
        // max size - 500 mb
        if (file.size > 500000000) {
            res.status(413).send('File is lager than 500MB.');
            return;
        }
        if(fs.existsSync('./uploads/' + filename)) {
            res.status(400).send("File is already exist please try in other name.");
            return;
        }
 
        //Todo - Other validations like file type etc are skipped for brevity.
 
        // using the mv() method to save the uploaded file in the
        // 'uploads' folder.
        file.mv('./uploads/' + filename, function (error) {
        if (error){
res.status(500).end("Have error while upload file.")
        }
        else{
            var path = filename.replace(/ /g, '%20');
res.end("Your file been uploaded success!\nURL: " + req.protocol + '://' + req.get('host') + "/files/" + path)
        }
    })
    } else {
        return res.status(400).send({ message: 'No file uploaded' });
    }
});
 
// start app
const PORT = process.env.port || 80;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});