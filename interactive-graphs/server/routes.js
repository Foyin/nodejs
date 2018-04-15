var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

var mc = require('mongodb').MongoClient;
var db, filesCollection, usersCollection;

var connectCallback = function(err, returnedDB) {
    if (err) {
        throw err;
    }

    db = returnedDB;
    
    filesCollection = db.collection('files');
    usersCollection = db.collection('users');
}

mc.connect('mongodb://localhost/upload-demo', connectCallback);

router.get('/', function (req, res) {
    if (req.session.username) {
        res.redirect("/users");
    } else {
        res.render('index', { title: 'COMP 2406 Final: Login', 
                              error: req.query.error });
    }
});

router.get('/getFileStats', function(req, res) {
    function returnStats(err, stats) {
        if (err) {
            sendStatus(500);
        } else {
            res.send(stats);
        }
    }
    
    if (req.session.username) {
        filesCollection.find({owner: req.session.username}, {content: 0})
            .toArray(returnStats);
    } else {
        res.send("ERROR: not logged in");
    }   
});

router.get('/users', function (req, res) {
    if (req.session.username) {
        res.render("account.jade", {username:req.session.username,
                                    title: "COMP 2406 Final: Account"});
    } else {
        res.redirect("/?error=Not Logged In");
    }
});



router.post("/uploadText", upload.single('theFile'), function(req, res) {
    var theFile = req.file;
    var storedFile;

    function returnResult(err, result) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.send("Upload succeeded: " + storedFile.name + "\n");
        }
    }
   
    if (theFile && (theFile.mimetype === 'text/plain')) {
        storedFile = {
            name: theFile.originalname,
            owner: req.session.username,
            size: theFile.size,
            content: theFile.buffer.toString('utf8')
        };
        filesCollection.update({name: theFile.originalname},
                               storedFile,
                               {upsert: true},
                               returnResult);
    } else {
        res.sendStatus(403);
    }
});

router.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var user;
    
    function passwordResult(err, authenticated){
        if (authenticated) {
            req.session.username = user.username;
            res.redirect("/users");
        } else {
            res.redirect("/?error=invalid username or password");       
        }
    }
    
    function usernameResult(err, users){
        if (err || users.length===0){
            res.redirect("/?error=invalid username or password");       
            return;
        }
        
        user = users[0];
        bcrypt.compare(password, user.password, passwordResult);
    }
    
    usersCollection.find({username: username}).toArray(usernameResult);
});

router.post("/logout", function(req, res) {
    req.session.destroy(function(err) {
        res.redirect("/");
    }); 
});


router.post("/register", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    function reportUpdateResult(err, newUsers) {
        var status;
        if (err) {
            status = "failed";
        } else {
            status = "succeeded";
        }
        res.render('registered', { title: "Registration " + status,
                                   username: username, status: status});
    }
    
    function storeSaltedPassword(err, hash) {
        var newUser = {
            username: username,
            password: hash,
        };
        
        usersCollection.update({username: username}, newUser,
                               {upsert: true}, reportUpdateResult);
    }

    function addUser(err, users) {
        if (users.length !== 0) {
            res.redirect("/?error=user already exists");        
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, storeSaltedPassword)});
        }
    }
    
    usersCollection.find({username: username}).toArray(addUser);
});

router.post("/downloadFile", function (req, res) {
    var name = req.body.downloadFile;

    function returnFile(err, theFile) {
        if (err) {
            res.send("File not found");
        } else {
            res.type('text/plain');
            res.send(theFile.content);
        }
    }

    if (!req.session.username) {
        res.send("Not logged in.");
    } else {
        filesCollection.findOne({name: name, owner: req.session.username},
                                returnFile);    
    }
});

module.exports = router;
