const { InlineKeyboard } = require("grammy");
const ChatIDs = require("../models/ChatIDS");
const Uploader = require("../models/Uploader");

module.exports = async (ctx) => {
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

    if (uploaderExists.length > 0) {
        if(uploaderExists[0].password) {
            const message = await ctx.reply("You are already registered. Why are you wasting my time?");
            setTimeout(async () => {
                await ctx.api.deleteMessage(message.chat.id, message.message_id);
            }, 3000);
            return null;
        } else {
            const inlineKeyboard = new InlineKeyboard()
				.text('Yes', 'register-user')
				.row()
				.text('No', 'exit-payload');

            const message = await ctx.reply(
                `Welcome to the United Walls Registration. @${uploaderExists[0].username}, it seems you are already added in our database. This registration is not necessary, and you can still use our bot to upload wallpapers, edit your profile, edit your wallpapers. This registration is only for our United Walls Creators App, available in both Play Store and App Store as well as in https://creators.paraskcd.com/ website. The App will give you a more easier way to handle your wallpapers and your profile in a Graphical User Interface. Alongwith, a well defined dashboard. Do you want to proceed?`,
                { reply_markup: inlineKeyboard, message_thread_id: ctx.message.message_thread_id }
            );

            return message;
        }
    } else {
        const inlineKeyboard = new InlineKeyboard()
			.text('Yes, I have an Invitation Code.', 'invitation-code')
			.row()
			.text('No, I do not have an Invitation Code.', 'exit-payload');

        const message = await ctx.reply(
            `Welcome to the United Walls Registration. It seems, you aren't added in our Database. In order to be able to register, you require an invitation code. You need to ask the admins of t.me/unitedsetups. So do you have an Invitation Code?`,
            { reply_markup: inlineKeyboard, message_thread_id: ctx.update.message.message_thread_id }
        );

        return message;
    }
}