const { cmd } = require("../command");

cmd({
  pattern: "group",
  desc: "Open/Close group",
  category: "group",
  react: "⚙️",
  filename: __filename
},
async (conn, mek, m, { from, args, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command only works in groups!");
    if (!isAdmins) return reply("❌ You must be an admin!");
    if (!isBotAdmins) return reply("❌ Bot must be admin!");

    if (args[0] === "open") {
      await conn.groupSettingUpdate(from, "not_announcement");
      reply("✅ Group is now *OPEN* for everyone!");
    } else if (args[0] === "close") {
      await conn.groupSettingUpdate(from, "announcement");
      reply("🔒 Group is now *CLOSED* (only admins can send messages)");
    } else {
      reply("⚙️ Usage:\n.group open\n.group close");
    }

  } catch (e) {
    console.log(e);
    reply("❌ Error!");
  }
});


// 👥 ADD MEMBER
cmd({
  pattern: "add",
  desc: "Add member",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, args, isGroup, isAdmins, isBotAdmins, reply }) => {
  if (!isGroup) return reply("Group only!");
  if (!isAdmins) return reply("Admin only!");
  if (!isBotAdmins) return reply("Bot must be admin!");

  let number = args[0];
  if (!number) return reply("Give number!\nExample: .add 947XXXXXXXX");

  await conn.groupParticipantsUpdate(from, [number + "@s.whatsapp.net"], "add");
  reply("✅ Member added!");
});


// ❌ REMOVE MEMBER
cmd({
  pattern: "kick",
  desc: "Remove member",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, mentionedJid, reply }) => {
  if (!isGroup) return reply("Group only!");
  if (!isAdmins) return reply("Admin only!");
  if (!isBotAdmins) return reply("Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag user!");

  await conn.groupParticipantsUpdate(from, [user], "remove");
  reply("❌ Member removed!");
});


// 🔼 PROMOTE
cmd({
  pattern: "promote",
  desc: "Promote admin",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, mentionedJid, reply }) => {
  if (!isGroup) return reply("Group only!");
  if (!isAdmins) return reply("Admin only!");
  if (!isBotAdmins) return reply("Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag user!");

  await conn.groupParticipantsUpdate(from, [user], "promote");
  reply("🔼 Promoted to admin!");
});


// 🔽 DEMOTE
cmd({
  pattern: "demote",
  desc: "Demote admin",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, mentionedJid, reply }) => {
  if (!isGroup) return reply("Group only!");
  if (!isAdmins) return reply("Admin only!");
  if (!isBotAdmins) return reply("Bot must be admin!");

  let user = mentionedJid[0];
  if (!user) return reply("Tag user!");

  await conn.groupParticipantsUpdate(from, [user], "demote");
  reply("🔽 Removed admin!");
});


// 📢 TAG ALL
cmd({
  pattern: "tagall",
  desc: "Tag everyone",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, participants, isGroup, reply }) => {
  if (!isGroup) return reply("Group only!");

  let teks = "📢 Tagging All Members:\n\n";
  let mentions = [];

  for (let mem of participants) {
    teks += `@${mem.id.split("@")[0]}\n`;
    mentions.push(mem.id);
  }

  conn.sendMessage(from, { text: teks, mentions });
});


// ℹ️ GROUP INFO
cmd({
  pattern: "ginfo",
  desc: "Group info",
  category: "group",
  filename: __filename
},
async (conn, mek, m, { from, isGroup, reply }) => {
  if (!isGroup) return reply("Group only!");

  let metadata = await conn.groupMetadata(from);

  let text = `📌 *Group Info*\n\n`;
  text += `📛 Name: ${metadata.subject}\n`;
  text += `👥 Members: ${metadata.participants.length}\n`;
  text += `📝 Desc: ${metadata.desc || "No description"}\n`;

  reply(text);
});
