import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  let prev = 5;
  const interval = setInterval(() => {
    // send immediatly a feedback to the incoming connection
    const d = prev + Math.random() * 1.5 * (Math.random() > prev / 10 ? 1 : -1);
    ws.send(
      JSON.stringify({
        t: Date.now(),
        d,
      })
    );
    prev = d;
  }, 50);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(
    `Server started on port ${
      (server.address() as WebSocket.AddressInfo).port
    } :)`
  );
});
