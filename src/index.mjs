import http from 'node:http';
import express from 'express';
import bodyParser from 'body-parser';

const name = 'RSA-OAEP';
const hash = 'SHA-256';
const format = 'spki';
const message = 'hello';

const app = express();

app.use(express.static('public'));
app.use(bodyParser.raw());

app.post('/keys', async (req, res) => {
  const importedPublicKey = await crypto.subtle.importKey(
    format,
    req.body,
    { name, hash },
    false,
    ['encrypt']
  );
  const encoded = new TextEncoder().encode(message).buffer;
  const encrypted = await crypto.subtle.encrypt(
    { name },
    importedPublicKey,
    encoded
  );
  res.end(Buffer.from(encrypted));
});

const server = http.createServer();

server.on('request', app);

server.on('listening', () => {
  console.log(`Listening on port ${server.address().port}`);
});

server.listen(4000);
