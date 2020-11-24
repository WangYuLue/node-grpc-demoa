import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { serverIP, serverPort } from '../config';

const PROTO_PATH = path.resolve(__dirname, '../proto/hello.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);

const helloProto: any = grpc.loadPackageDefinition(packageDefinition).hello;

function sayHello(call, callback) {
  callback(null, { message: 'Hello World' })
}

function sayHelloWithName(call, callback) {
  callback(null, { message: `Hello ${call.request.name}` })
}

function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Hello.service, {
    hello: sayHello,
    helloWithName: sayHelloWithName
  })
  server.bindAsync(`${serverIP}:${serverPort}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`GRPC server running on ${serverIP}:${serverPort}`);
  });
}

main();