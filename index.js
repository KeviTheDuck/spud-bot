//import { Client, LocalAuth, MessageMedia } from "whatsapp-web.js"
import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from "qrcode-terminal";

import ytdl from "ytdl-core";
import fs from "file-system";
const client = new Client({
    puppeteer: {
        executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", (message) => {
    console.log(message.from, message.body);
});
// yt and reels

client.on("message", (message) => {
    const msgSplit = message.body.split(" ");
    if (message.body == "test") {
        console.log("got it");
        const media = MessageMedia.fromFilePath("skull-pog.mp4");
        console.log("sending");
        client.sendMessage(message.from, media);
        console.log("sent");
    }
    if (msgSplit.includes("-yt")) {
        let ytVideoID;
        if (message.body.split("/").includes("shorts")) {
            ytVideoID = `https://www.youtube.com/watch?v=${
                message.body.split("/shorts/")[1]
            }`;
        } else ytVideoID = msgSplit[1]
        console.log(ytVideoID)
        let vidID = "./yt/" + String(new Date().getTime()) + ".mp4";

        const video = ytdl(ytVideoID, { quality: 18 });

        video.on("progress", function (info) {
            //console.log("downloading..")
        });
        video.on("end", function (info) {
            message.reply("sending video...");
        });
        video.pipe(fs.createWriteStream(vidID));
        setTimeout(function () {
            const media = MessageMedia.fromFilePath(vidID);
            client.sendMessage(message.from, media);
            fs.unlinkSync(vidID)
        }, 10000);
    }
});
client.initialize();
