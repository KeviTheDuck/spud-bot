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

client.on("message", (message) => {
    const msgSplit = message.body.split(" ");
    if (message.body == "test") {
        console.log("got it");
        const media = MessageMedia.fromFilePath("skull-pog.mp4");
        console.log("sending");
        client.sendMessage(message.from, media);
        console.log("sent");
    }
    // -yt allows users to download yt videos and shorts
    if (msgSplit.includes("-yt")) {
        let ytVideoLink;
        // converts the shorts into a yt video format
        if (message.body.split("/").includes("shorts")) {
            ytVideoLink = `https://www.youtube.com/watch?v=${
                // gets the video/short ID
                message.body.split("/shorts/")[1].split("?feature=share")[0]
            }`;
        } else ytVideoLink = msgSplit[1]
        
        let vidPath = "./yt/" + String(new Date().getTime()) + ".mp4";

        // downloading the video and saving it in ./yt/ temporarily 
        const video = ytdl(ytVideoLink, { quality: 18 });
        video.on("progress", function (info) {
            //console.log("downloading..")
        });
        video.on("end", function (info) {
            message.reply("sending video...");
        });
        video.pipe(fs.createWriteStream(vidPath));

        setTimeout(function () {
            // sending the video
            const media = MessageMedia.fromFilePath(vidPath);
            client.sendMessage(message.from, media);
            
            // deleting the video
            fs.unlinkSync(vidPath)
        }, 10000);
    }
});
client.initialize();
