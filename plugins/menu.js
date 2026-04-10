const { cmd } = require("../command");
const os = require("os");

const menuData = {
  "1": `📥 *DOWNLOAD MENU*
.fb
.apk
.movie`,

  "2": `👥 *GROUP MENU*
.group open
.group close
.kick
.add
.promote
.demote
.tagall`,

  "3": `⚙️ *MAIN MENU*
.menu
.ping
.alive
.owner`,

  "4": `🔥 *OWNER MENU*
.restart
.broadcast`
};

cmd({
  pattern: "menu",
  desc: "Number menu system",
  category: "main",
  react: "📜",
  filename: __filename
},
async (conn, mek, m, { from, pushName, reply }) => {

  let text = `
🤖 *BOT MENU*

👋 Hi ${pushName || "User"}

👉 Reply with number:
1️⃣ Download Menu
2️⃣ Group Menu
3️⃣ Main Menu
4️⃣ Owner Menu

📌 Example: reply "1"
`;

  await conn.sendMessage(from, { text }, { quoted: mek });

  // save session for reply tracking
  global.menuSession = global.menuSession || {};
  global.menuSession[from] = true;
});


// 👇 HANDLE NUMBER REPLY
cmd({
  on: "text"
},
async (conn, mek, m, { from, body, reply }) => {

  if (!global.menuSession || !global.menuSession[from]) return;

  let text = body.trim();

  if (menuData[text]) {
    return conn.sendMessage(from, { text: menuData[text] }, { quoted: mek });
  }

  if (["1","2","3","4"].includes(text)) return;

  // if user sends other text → ignore
});
