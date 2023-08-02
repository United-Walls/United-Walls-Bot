const Uploader = require("../models/Uploader");

const editUploaderUsernameMethod = async (ctx, userId) => {
    const username = ctx.update.message.text;

    if (username != undefined) {
        const uploader = await Uploader.findOneAndUpdate( {userID: userId}, {
            username: username
        });

        await ctx.reply(`Updated to - ${username} -`, {message_thread_id: ctx.update.callback_query.message.message_thread_id});
    }
}

module.exports = editUploaderUsernameMethod