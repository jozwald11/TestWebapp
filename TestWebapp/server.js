'use strict';
let http = require('http');
let fs = require('fs');
let path = require('path');
let port = process.env.PORT || 1337;


fs.readdir(path.resolve("./www"), function (error, fileArray) {
    //pause();
    if (error) {
        console.error("Could not read files");
    }
    else {
        let fileMap = {};
        console.log(fileArray);
        fileArray.forEach(function (e) {
            fs.readFile(path.resolve("www", e), function (error, data) {
                if (error)
                    console.warn(e + " has no data assosiated");
                else
                    fileMap["/" + e] = data;
            });
        });
        http.createServer(function (req, res) {
            let data = fileMap[req.url];
            if (data == null) {
                console.log("error")
                res.writeHead(404);
                res.end();
            }
            else {
                res.writeHead(200);
                res.write(data);
                res.end();
            }
            console.log(req.url);
        }).listen(port);
    }
});


