import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as express from 'express';
import { serverIP, serverPort, clientIP, clientPort } from '../config';

const PROTO_PATH = path.resolve(__dirname, '../proto/hello.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const helloProto: any = grpc.loadPackageDefinition(packageDefinition).hello;

const grpcClient = new helloProto.Hello(`${serverIP}:${serverPort}`, grpc.credentials.createInsecure());

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  next()
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong')
});

app.get('/hello', (req, res) => {
  grpcClient.hello({}, (err, response) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    res.status(200).json(response)
  })
});

app.get('/hello-with-name', (req, res) => {
  const name = req.query.name;
  grpcClient.helloWithName({ name }, (err, response) => {
    if (err) {
      res.status(500).json({ message: err })
    }
    res.status(200).json(response)
  })
});

app.listen(clientPort, () => {
  console.log(`GRPC client running on ${clientIP}:${clientPort}`);
})