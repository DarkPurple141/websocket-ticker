import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

app.use(express.static(path.join(__dirname, '../client')));

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.info('connection left.');
  });
  setInterval(() => {
    //send immediatly a feedback to the incoming connection
    ws.send(
      JSON.stringify({
        t: Date.now(),
        d: 5 + Math.random() * 2 * (Math.random() > 0.5 ? -1 : 1),
      })
    );
  }, 30);
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo).port
    } :)`
  );
});
