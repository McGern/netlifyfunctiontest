'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": process.env.PROJECT_ID,
  "private_key_id": "0529c61f440cc1c7fcd01cdc6394d0511f91b920",
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": "112912266470809384381",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-48zvz%40fir-testagent.iam.gserviceaccount.com"
}),
  databaseURL: "https://${process.env.PROJECT_ID}.firebaseio.com"
});

const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

router.get("/users", async function (request, response) {
  var userRef = db.collection('users');

  var users = [];
  var docs = await userRef.where('psid', '>', '').get();
  docs.forEach( doc => {
    var data = doc.data();
    users.push({id:doc.id, firstName: data.name, psid: data.psid} );
  });

  response.send(users);

});


app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);