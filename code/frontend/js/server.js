var http = require('http'); // 1 - 載入 Node.js 原生模組 http
 
var server = http.createServer(function (req, res) {   // 2 - 建立server
    if (req.url == '/data') { //check the URL of the current request
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: "Hello World"}));
        res.end();
}
});
 
server.listen(5000); //3 - 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
 
console.log('Node.js web server at port 5000 is running..')