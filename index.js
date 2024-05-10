const express = require("express");
const http = require('http');
const app = express();
const server = http.createServer(app);
const WebSocket = require('ws');
const { saveData, checkReadOrCreateFile, readFile, shortenUrl, isValidUrl } = require("./helpers");

const port = 3000;
const filePath = './data.json';

const wss = new WebSocket.Server({ server });
const clients = new Map();

// Initialise the websocket connection
wss.on('connection', (ws) => {
  const id = Date.now();
  clients.set(id, ws);
  console.log(`Client connected: ${id}`);

  ws.on('message', (message) => {
    console.log(`Received message from ${id}: ${message}`);
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`Client disconnected: ${id}`);
  });
});

// Initialise express
app.use(express.json());

// API call to initiate url shortening
app.post('/url', async (req, res) => {
  let base_url = `${req.protocol}://${req.get('host')}`; // Get the server's base url
  console.log(`Base URL :: ${base_url}`);
  let url = req.query.url
  if (!isValidUrl(url)) { // Check if the url is a valid format
    return res.status(400).send("Unable to validate the url");
  }
  try {
    let shortenedUrl = shortenUrl(base_url)
    let existingRecords = await checkReadOrCreateFile(filePath) // Check if a file already exists with records. If not, create one.
    existingRecords[url] = shortenedUrl;;
    await saveData(existingRecords, filePath) // Save the record to the data file

    for (const [id, ws] of clients.entries()) { // Send the message to the connected websockets
      if (ws.readyState === WebSocket.OPEN) {
        let message = { shortenedURL: shortenedUrl }
        ws.send(JSON.stringify(message));
      }
    }
    res.status(200).send("A record has successfully been created");
  } catch (error) {
    console.error('ERROR CREATING RECORD :: ', error);
    res.status(500).json({ error: 'An error occurred while creating the record' });
  }
})

app.get('/:urlCode', async (req, res) => {
  try {
    let urlCode = req.params.urlCode;
    let fullUrl = `${req.protocol}://${req.get('host')}/${urlCode}`;
    let existingRecords = await readFile(filePath)

    // return the corresponding original url
    let record = Object.keys(existingRecords).find(key => existingRecords[key] === fullUrl);

    res.status(200).json({ url: record });
  } catch (error) {
    console.error('ERROR FETCHING RECORD :: ', error);
    res.status(500).json({ error: 'An error occurred while fetching the record' });
  }
})

// Start Server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
