## Usage
Install the necessary packages by running terminal from the root directory: 
```bash
npm install
```

Start the server by running 
```bash
node index.js
```
Once the server is up and running, you can interact with the API endpoints using a client that supports HTTP calls and web sockets.
To test the flow of the API calls, run the following steps:

- Connect to the web socket at ```ws://localhost:3000 ```
- Call the shorten url endpoint with an HTTP POST call
```http://localhost:3000/url```
and set a param called ```url``` with the value of a domain, eg ```classcalc.com```
- After making the post call, you should receive a message response in your web socket that looks like this:
```json 
{
    "shortenedURL": "http://localhost:3000/68c96c5144"
}
```
- You can now make a GET call to the server using the shortenedURL, i.e 
``` http://localhost:3000/68c96c5144 ```
If successful, you will receive a response with the original url:
 ```json 
{
    "url": "classcalc.com"
}
```
- You can now close or disconnect your web socket and server