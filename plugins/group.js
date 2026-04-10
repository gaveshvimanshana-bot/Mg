const { cmd } = require("../command");

async function checkAdmin(conn, from, sender) {
  const metadata = await conn.groupMetadata(from);
  const participants = metadata.participants;

  const admins = participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  return admins.includes(sender);
}

async function checkBotAdmin(conn, from) {
  const metadata = await conn.groupMetadata(from);
  const participants = metadata.participants;

  const botId = conn.user.id.split(":")[0] + "@s.whatsapp.net";

  const admins = participants
    .filter(p => p.admin !== null)
    .map(p => p.id);

  return admins.includes(botId);
}

/* ================= OPEN / CLOSE ================= */
cmd({
  pattern: "group",
  category: "group",
  react: "⚙️",
  filename: __filename
},
async (conn, mek, m, { from, args, isGroup, reply }) => {

  if (!isGroup) return reply("❌ Group only!");

  const isAdmin = await checkAdmin(conn, from, m.sender);
  const isBotAdmin = await checkBotAdmin(conn, from);

  if (!isAdmin) return reply("❌ Admin only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin!");

  if (args[0] === "open") {
    await conn.groupSettingUpdate(from, "not_announcement");
    return reply("✅ Group OPEN now");
  }

  if (args[0] === "close") {
    await conn.groupSettingUpdate(from, "announcement");
    return reply("🔒 Group CLOSED now");
  }

  reply("Usage:\n.group open\n.group close");
});


/* ================= KICK ================= */
cmd({
  pattern: "kick",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, mentionedJid }) => {

  if (!isGroup) return reply("Group only!");

  const isAdmin = await checkAdmin(conn, from, m.sender);
  const isBotAdmin = await checkBotAdmin(conn, from);

  if (!isAdmin) return reply("❌ Admin only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag someone!");

  await conn.groupParticipantsUpdate(from, [user], "remove");
  reply("❌ User removed");
});


/* ================= PROMOTE ================= */
cmd({
  pattern: "promote",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, mentionedJid }) => {

  if (!isGroup) return reply("Group only!");

  const isAdmin = await checkAdmin(conn, from, m.sender);
  const isBotAdmin = await checkBotAdmin(conn, from);

  if (!isAdmin) return reply("❌ Admin only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag user!");

  await conn.groupParticipantsUpdate(from, [user], "promote");
  reply("🔼 Promoted");
});


/* ================= DEMOTE ================= */
cmd({
  pattern: "demote",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, mentionedJid }) => {

  if (!isGroup) return reply("Group only!");

  const isAdmin = await checkAdmin(conn, from, m.sender);
  const isBotAdmin = await checkBotAdmin(conn, from);

  if (!isAdmin) return reply("❌ Admin only!");
  if (!isBotAdmin) return reply("❌ Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag user!");

  await conn.groupParticipantsUpdate(from, [user], "demote");
  reply("🔽 Demoted");
});


/* ================= TAGALL ================= */
cmd({
  pattern: "tagall",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, reply }) => {

  if (!isGroup) return reply("Group only!");

  const metadata = await conn.groupMetadata(from);

  let text = "📢 Tag All Members:\n\n";
  let mentions = [];

  for (let p of metadata.participants) {
    text += `@${p.id.split("@")[0]}\n`;
    mentions.push(p.id);
  }

  conn.sendMessage(from, { text, mentions });
});
