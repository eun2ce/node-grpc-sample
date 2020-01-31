const grpc = require('grpc');
const path = require('path');
const PROTO_PATH = path.join(__dirname, '/greet.proto');
const greet = grpc.load(PROTO_PATH).greet;
let db = require('./db.json');

class Greet {
  getList (call, callback) {
    return callback(null, {
      greets: db
    })
  }
  getById (call, callback) {
    for (var i = 0; i < db.length; i++) {
      if (db[i].id === call.request.id) {
        return callback(null, db[i]);
      }
    }
    return callback('Can not find greet.');
  }
  insert (call, callback) {
    let newGreet = Object.assign({}, call.request);
    newGreet.id = (db.length + 1) + '';
    db.push(newGreet);
    return callback(null, newGreet);
  }
  update (call, callback) {
    if (!call.request.id) {
      return callback('Greet id can not find.');
    }
    for (var i = 0; i < db.length; i++) {
      if (db[i].id === call.request.id) {
        const newGreet = Object.assign(db[i], call.request);
        db.splice(i, 1, newGreet);
        return callback(null, newGreet);
      }
    }
    return callback('Can not find greet.');
  }
  remove (call, callback) {
    if (!call.request.id) {
      return callback('Greet id can not find.');
    }
    for (var i = 0; i < db.length; i++) {
      if (db[i].id === call.request.id) {
        db.splice(i, 1);
        return callback(null);
      }
    }
    return callback('Can not find greet.');
  }
}

const getServer = function (service, serviceCall, lintener) {
  const server = new grpc.Server();
  server.addService(service, serviceCall);
  server.bind(lintener, grpc.ServerCredentials.createInsecure());
  return server;
}

function main() {
  const greetServer = getServer(greet.service, new Greet, '0.0.0.0:5051');
  greetServer.start();
}

main();
