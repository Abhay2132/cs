const fs = require("fs")
const http = require("http")
const path = require("path")
const mime = require("mime/lite")

const port = process.env.PORT || 3000;

http.createServer((req, res) => {
	let {url, method} = req;
	if(method !== "GET") return res.end();
	log(req, res);
	let uri = path.join(path.resolve(), "public", url)
	if(!fs.existsSync(uri))
		return r404(res);
	return send(res, uri)
})
.listen(port, () =>{
	console.log("-".repeat(46))
	console.log("Server is online at localhost:%d", port);
	console.log("-".repeat(46))
})

function r404 (res) {
	res.writeHead(404);
	res.end()
}

function send(res, file) {
	if(!fs.existsSync(file))
		return r404(res);
	let stat = fs.statSync(file);
	if(stat.isDirectory())
		return send(res, path.join(file, "index.html"))
	let ext = file.split(".").at(-1).split("?")[0];
	let type = mime.getType(ext) || "octet/stream";
	
	res.writeHead(200, {
		"Content-Type" : type,
		"Content-Length": stat.size
	});
	
	fs.createReadStream(file)
	.pipe(res);
}

function log(req, res) {
	let it = performance.now()
	
	res.on("finish", () => {
		let te = (performance.now() -it).toFixed(2)+"ms"
		console.log(req.method,  te, req.url)
	})
}