const promise = require('bluebird');
const co = require('co');
const path = require('path');
const grpc = require('grpc');
const PROTO_PATH = path.join(__dirname, '/greet.proto');
const Client = grpc.load(PROTO_PATH).greet;

const getClient = function (address) {
  return new Client(address, grpc.credentials.createInsecure());
};

function main() {
  const greetClient = getClient('127.0.0.1:5051');

  greetClient.insert({
    content: 'This is your greet5',
    title: 'greet title',
    isPublic: true,
    url: 'greet-title',
    cover: 'xxxxx.jpg'
  }, function(err, res) {
    if (err) {
      return console.log(err);
    }
    console.log('Insert success');
    return console.log(res);
  });

  greetClient.getById({id: '1'}, function(err, res) {
    if (err) {
      return console.log(err);
    }
    console.log(`Get by id 1: ${res}`);
    return console.log(res);
  });

  greetClient.update({
    id: '1',
    content: 'This is your update greet',
    title: 'greet title',
    isPublic: true,
    url: 'greet-title',
    cover: 'xxxxx.jpg'
  }, function(err, res) {
    if (err) {
      return console.log(err);
    }
    console.log(`update greet id 1: ${res}`);
    return console.log(res);
  });

  greetClient.getList({}, function(err, res) {
    if (err) {
      return console.log(err);
    }
    console.log(`greet list: ${res}`);
    return console.log(res.greets);
  });
}

main();
