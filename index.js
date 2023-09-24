const express = require('express');
const bodyParser = require('body-parser');
const http = require('http')
const db = require('./db.json');
const cors = require('cors');
const app = express();
const port = 3001;

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  "origin": function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log(origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));

app.use(express.json());

// Parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

app.post('/api/send_message', (req, res) => {
    console.log(req.body);

    var id = makeid(4);
    req.body.id = id;
    console.log(req.body);

    db.push(req.body);
    var fs = require('fs');
    fs.writeFile('./db.json', JSON.stringify(db, null, '\t'), function (err, result) {
      if (err) console.log('error', err);
    });

    ws_android_server.clients.forEach((client) => {
        client.send(JSON.stringify(req.body));
      });

    res.send("Okay");
})

// Start the server
host = 'localhost'
app.listen(port);
console.log('Server listening on ' + host + ':' + port);

// Websocket
const WebSocket = require('ws')
const { Server } = require('ws');
let android_app = express();
let android_server = http.createServer(android_app);
android_server.listen(3002,()=>{
  console.log(`Server is listening at port 3002`)
})

const ws_android_server = new Server({ server:android_server });

ws_android_server.on('connection', (ws) => {
    console.log('New client connected!');
        
    ws.on('close', () => console.log('Client has disconnected!'));
  });
