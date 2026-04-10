const { cmd } = require("../command");

const menuData = {
  "1": `📥 DOWNLOAD MENU\n.fb\n.apk\n.movie`,
  "2": `👥 GROUP MENU\n.group open\n.group close\n.kick\n.add\n.promote\n.demote\n.tagall`,
  "3": `⚙️ MAIN MENU\n.menu\n.ping\n.alive`,
  "4": `🔥 OWNER MENU\n.restart\n.broadcast`
};

cmd({
  pattern: "menu",
  react: "📜",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {

  global.menuMode = global.menuMode || {};

  global.menuMode[from] = true;

  let text = `
🤖 BOT MENU

👉 Reply with number:
1️⃣ Download Menu
2️⃣ Group Menu
3️⃣ Main Menu
4️⃣ Owner Menu
`;

  await conn.sendMessage(from, { text }, { quoted: mek });
});
