'use strict';
let http = require('http');
let fs = require('fs');
let path = require('path');
let mime = require('mime-types');
let port = process.env.PORT || 1337;

fs.readFile("./settings.json", function (error, settingsRaw) {
    if (error) {
        console.error("Could not read settings");
    }
    else {
        try {
            let settingsString = settingsRaw.toString().trim();
            let settings = JSON.parse(settingsString);
            //console.log(settings);
            fs.readdir(path.resolve("./www"), function (error, fileArray) {
                if (error) {
                    console.error("Could not load files");
                }
                else {
                    let fileMap = {};
                    let mimeMap = {};
                    fileArray.forEach(function (e) {
                        fs.readFile(path.resolve("www", e), function (error, data) {
                            if (error)
                                console.warn(e + " has no data assosiated");
                            else {
                                fileMap["/" + e] = data;
                                mimeMap["/" + e] = mime.lookup("/" + e);
                            }
                        });
                    });
                    http.createServer(function (req, res) {
                        console.log(req.url);
                        let data = fileMap[req.url];
                        let mimeType = mimeMap[req.url];
                        let redirect = settings.redirects[req.url];
                        console.log(mimeMap);
                        if (fileMap[redirect] != null) {
                            data = fileMap[redirect];
                            mimeType = mimeMap[redirect];
                        }
                        if (data == null) {
                            console.log("404")
                            data = fileMap[settings.error404];
                            res.writeHead(404, { 'Content-Type': mimeMap[settings.error404] });
                            if (data != null)
                                res.write(data);
                            else
                                console.warn("404 page not found, Check settings")
                            res.end();
                        }
                        else {
                            res.writeHead(200, { 'Content-Type': mimeType});
                            res.write(data);
                            res.end();
                        }
                        //console.log(req.url);
                    }).listen(port);
                }
            });
        }
        catch (e) {
            console.error("Invalid Settings:\n" + e);
        }
    }
});


