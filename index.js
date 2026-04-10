const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require('@whiskeysockets/baileys')

const { getGroupAdmins } = require('./lib/functions')
const { sms } = require('./lib/msg')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const axios = require('axios')

const prefix = '.'
const ownerNumber = ['94789706579']

// ================= SESSION =================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
if (!config.SESSION_ID) {
console.log('❌ SESSION_ID missing!')
}
const { File } = require('megajs')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
filer.download((err, data) => {
if (err) throw err
fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
console.log("Session downloaded ✅")
})
})
}

// ================= EXPRESS =================
const express = require("express")
const app = express()
const port = process.env.PORT || 8000

global.menuSession = {}

async function connectToWA() {

console.log("Connecting bot...")

const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/auth_info_baileys/')
const { version } = await fetchLatestBaileysVersion()

const conn = makeWASocket({
logger: P({ level: 'silent' }),
printQRInTerminal: false,
browser: Browsers.macOS("Chrome"),
auth: state,
version
})

// ================= CONNECTION =================
conn.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update

if (connection === 'close') {
if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
connectToWA()
}
}

if (connection === 'open') {
console.log('🤖 BOT CONNECTED SUCCESS')

fs.readdirSync("./plugins/").forEach((file) => {
if (file.endsWith(".js")) {
require("./plugins/" + file)
}
})

conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
text: "🤖 Bot Connected Successfully!"
})
}
})

conn.ev.on('creds.update', saveCreds)

// ================= MESSAGE =================
conn.ev.on('messages.upsert', async (chatUpdate) => {
const mek = chatUpdate.messages[0]
if (!mek.message) return

const mtype = getContentType(mek.message)
const from = mek.key.remoteJid

const body =
(mtype === 'conversation') ? mek.message.conversation :
(mtype === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
(mtype === 'imageMessage') ? mek.message.imageMessage.caption :
(mtype === 'videoMessage') ? mek.message.videoMessage.caption : ''

const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0] : ''
const args = body.trim().split(/ +/).slice(1)

const reply = (text) => conn.sendMessage(from, { text }, { quoted: mek })

// ================= MENU REPLY SYSTEM =================
if (global.menuSession[from]) {

const menuData = {
"1": `📥 DOWNLOAD MENU\n.fb\n.apk\n.movie`,
"2": `👥 GROUP MENU\n.group open\n.group close\n.kick\n.add\n.promote\n.demote\n.tagall`,
"3": `⚙️ MAIN MENU\n.menu\n.ping\n.alive`,
"4": `🔥 OWNER MENU\n.restart\n.broadcast`
}

let txt = body.trim()

if (menuData[txt]) {
await conn.sendMessage(from, { text: menuData[txt] }, { quoted: mek })
return
}
}

// ================= COMMAND LOADER =================
const events = require('./command')
const cmdName = command.toLowerCase()

if (isCmd) {
const cmd = events.commands.find(c => c.pattern === cmdName)

if (cmd) {
if (cmd.react) {
conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } })
}

try {
cmd.function(conn, mek, sms(conn, mek), {
from, body, args, reply
})
} catch (e) {
console.log("PLUGIN ERROR:", e)
}
}
}

// ================= ON EVENTS =================
events.commands.map((command) => {

if (body && command.on === "body") {
command.function(conn, mek, sms(conn, mek), { from, body, reply })
}

if (body && command.on === "text") {
command.function(conn, mek, sms(conn, mek), { from, body, reply })
}

})

})

// ================= SERVER =================
app.get("/", (req, res) => {
res.send("BOT RUNNING ✅")
})

app.listen(port, () => console.log("Server running on " + port))

setTimeout(connectToWA, 3000)
