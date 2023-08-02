const ChatIDs = require("../models/ChatIDS");
const Uploader = require("../models/Uploader");

module.exports = async (ctx, next) => {
    let chatId = ctx.update.message.chat.id;

	let uploaderExists = await Uploader.find({ userID: ctx.update.message.from.id });
	let chatIdExists = await ChatIDs.find({ user: uploaderExists });

    if (ctx.update.message.chat.id == ctx.update.message.from.id) {
		if (uploaderExists.length > 0) {
			if (chatIdExists.length > 0) {
				await ChatIDs.findOneAndUpdate({ user: uploaderExists[0] }, { chatId: chatId });
			} else {
				await ChatIDs.create({
					chatID: chatId,
					user: uploaderExists[0]
				})
			}
		}
	}

    const message = await ctx.reply(
		'*Hi\\!* _Welcome_ to [United Walls](t.me/UnitedWalls_Bot)\\.',
		{ parse_mode: 'MarkdownV2', message_thread_id: ctx.update.message.message_thread_id }
	);
	const message2 = await ctx.reply(
		"As you see\\, I'm just a bot\\. Join our Group to access our Awesome Walls\\! \\:\\)\n\nOur Group is [United Setups](t.me/unitedsetups)\\.",
		{ parse_mode: 'MarkdownV2', message_thread_id: ctx.update.message.message_thread_id }
	);

    next();
}