const { Client, LocalAuth } = require("whatsapp-web.js");
const  qrcode = require('qrcode-terminal')
const client = new Client({
    puppeteer: {
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    authStrategy: new LocalAuth()
});

client.on("qr", (qr) => {
    qrcode.generate(qr, {small:true})
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", message => {
    console.log(message.from, message.body)
})
// yt and reels
client.initialize();
