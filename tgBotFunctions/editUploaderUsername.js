const Uploader = require("../models/Uploader");

const editUploaderUsernameMethod = async (ctx, messageToUpdate, userId) => {
    const username = ctx.message.text;

    if (username != undefined) {
        const uploader = await Uploader.findOneAndUpdate( {userID: userId}, {
            username: username
        });

        await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, `username Updated to - ${username}`, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });
    }
}

module.exports = editUploaderUsernameMethod