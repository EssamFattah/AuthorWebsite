var cors = require('cors');
const sqlite = require('sqlite3').verbose();
let db = my_database('./gallery.db');

var express = require("express");
var app = express();

app.use(cors());
app.use(express.json());

//GET ALL ITEMS
app.get('/', function(req, res) {
    db.all(`SELECT * FROM gallery`, function(err, rows) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: err.message});
        }
        res.type('json');
        return res.status(200).json(rows);
    });
});

//GET SPECIFIC ITEM
app.get('/:id', function(req, res) {
    db.all(`SELECT * FROM gallery WHERE id=?`, [req.params.id], function(err, rows) {
        if (err) {
        return res.status(500).json({error: err.message});
        }
        if (rows.length === 0) {
        return res.status(404).json({error: 'Item not found'});
        }
        res.type('json');
        return res.status(200).json(rows[0]);
    });
});
  
//PUT
app.put('/items/:id', function(req, res) {    
    const itemId = req.params.id;
    const item = req.body;

    db.get(`SELECT * FROM gallery WHERE id=?`, [itemId], function(err, row) {
        if (err) {
            return res.status(400).json({
                error: 'Unable to fetch the item'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Item with id ' + req.params.id + ' does not exist'
            });
        }

        db.run(`UPDATE gallery SET author=?, alt=?, tags=?, image=?, description=? WHERE id=?`,
            [item['author'], item['alt'], item['tags'], item['image'], item['description'], itemId], function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Unable to update the item'
                    });
                }

                return res.status(204).json({
                    message: 'Item updated successfully'
                });
            });
    });
});


//DELETE
app.delete('/delete/:id', (req, res) => {
    db.get(`SELECT * FROM gallery WHERE id=?`, [req.params.id], function(err, row) {
        if (err) {
            return res.status(400).json({error: 'Unable to fetch the item'});
        }
        if (!row) {
            return res.status(404).json({error: 'item with id ' + req.params.id + ' does not exist'})
        }
        db.run(`DELETE FROM gallery WHERE id=?`, [req.params.id], (err, row) => {
            if (err){
                console.error(err.message);
                return res.status(500).send(err.message);
            }
            res.type('json');
            return res.status(204).json({message: 'Author with id ' + req.params.id + ' deleted successfully'});
        })
    })
})

//POST
app.post('/add', (req, res) => {
    let item = req.body
    db.all(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [item['author'], item['alt'], item['tags'], item['image'],  item['description']], (err, rows) => {
        if (err){
            console.error(err.message);
            return res.status(500).send(err.message);
        }
        res.type('json');
        return res.status(200).json({item});
    })
})

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS gallery
        	 (
                    id INTEGER PRIMARY KEY,
                    author CHAR(100) NOT NULL,
                    alt CHAR(100) NOT NULL,
                    tags CHAR(256) NOT NULL,
                    image char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);
		db.all(`select count(*) as count from gallery`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Tim Berners-Lee",
        			"Image of Berners-Lee",
        			"html,http,url,cern,mit",
        			"https://upload.wikimedia.org/wikipedia/commons/9/9d/Sir_Tim_Berners-Lee.jpg",
        			"The internet and the Web aren't the same thing."
    				]);
				db.run(`INSERT INTO gallery (author, alt, tags, image, description) VALUES (?, ?, ?, ?, ?)`, [
        			"Grace Hopper",
        			"Image of Grace Hopper at the UNIVAC I console",
        			"programming,linking,navy",
        			"https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg",
				"Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)."
    				]);
				console.log('Inserted dummy photo entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}