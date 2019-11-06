const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Api, JsonRpc, RpcError } = require("eosjs");
const JsSignatureProvider = require("eosjs/dist/eosjs-jssig").default;
const fetch = require("node-fetch");
const { TextEncoder, TextDecoder } = require("util");

const signatureProvider = new JsSignatureProvider([]);
let dspEndptArr = "https://jungle2.cryptolions.io:443";
const chainId =
  "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473";
const ecc = require("eosjs-ecc");
let contract_account = "billpayfirst";
let rpc = new JsonRpc(dspEndptArr, { fetch });
let api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});

const owner_key = "5Hq8aya5iD1m88ReJwMx1gNGGz8iZvWtZXDWQd6BURjCWdtnNn6";
const user_key = "5KjCcJZeaCCJEZkhSYwDzwP3hzrwAiKZ6TKkWn8f9enofp7RaT9";

let app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

app.post("/test_first_auth", async (req, res) => {
  try {
    const resultcontract = await api.transact(
      {
        actions: [
          {
            account: contract_account,
            name: "paybyowner",
            authorization: [
              {
                actor: contract_account,
                permission: "active"
              }
            ],
            data: {
              username: req.body.username
            }
          },
          {
            account: contract_account,
            name: "paybyuser",
            authorization: [
              {
                actor: req.body.username,
                permission: "active"
              }
            ],
            data: {
              username: req.body.username
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
        broadcast: false,
        sign: false
      }
    );

    console.log("serialized trx", resultcontract);

    const signBuf = Buffer.concat([
      new Buffer(chainId, "hex"),
      new Buffer(resultcontract.serializedTransaction),
      new Buffer(new Uint8Array(32))
    ]);   // serialized trx to sign

    let signature_owner = ecc.Signature.sign(signBuf, owner_key).toString();     //signing by different party with diferent keys
    let signature_user = ecc.Signature.sign(signBuf, user_key).toString();

    let resultcontrac_new = {};
    resultcontrac_new.signatures = [];
    resultcontrac_new.signatures.push(signature_owner);
    resultcontrac_new.signatures.push(signature_user);

    resultcontrac_new.serializedTransaction =
      resultcontract.serializedTransaction;

    let finalres = await api.pushSignedTransaction(resultcontrac_new);
    console.log(finalres);
  } catch (err) {

    res.status(400).send(err);
  }
});
app.listen(3000, function () {
  console.log("listening on 3000,");
});
