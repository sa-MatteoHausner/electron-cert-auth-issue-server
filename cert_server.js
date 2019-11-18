
var fs = require('fs')
var https = require('https')
var express = require('express')
var app = express()
var port = 8443

var options = {
    key: fs.readFileSync('certs/server-key.pem'),
    cert: fs.readFileSync('certs/server.pem'),
    ca: fs.readFileSync('certs/ca-cert.pem'),
    requestCert: true,
    rejectUnauthorized: true,
    secureOptions: require('constants').SSL_OP_NO_TICKET
}

app.get('/', function (req, res) {
    console.log(new Date() + ' ' +
        req.connection.remoteAddress + ' ' +
        req.socket.getPeerCertificate().subject.CN + ' ' +
        req.method + ' ' + req.url)
    res.send("Hello " + req.socket.getPeerCertificate().subject.CN + "!\n")
})

var httpsServer = https.createServer(options, app);
httpsServer.keepAliveTimeout = 100;
httpsServer.listen(port, function () {
    console.log('Auth cert server listening on port: ' + port)
    console.log('Request with: curl https://localhost:8443/  --cacert certs/ca-cert.pem --cert certs/client.pem  -vvv')
})
