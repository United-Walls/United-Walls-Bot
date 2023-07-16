const Uploader = require("../models/Uploader");

const editUserMenuMethod = async (ctx, userId) => {
    const uploader = await Uploader.findOne({ userID: parseInt(userId) });

    let editKeyboard;

    if (uploader.avatar_file_url === null) {
        editKeyboard = {
            inline_keyboard: [
                [{ text: 'Edit username', callback_data: `EUs_${userId}`}],
                [{ text: 'Add Avatar (can be your logo, profile pic, etc)', callback_data: `Av_${userId}`}],
                [{ text: 'Go back', callback_data: `Upl_${userId}` }],
                [{ text: 'Exit', callback_data: 'exit-payload' }],
            ],
        };
    } else {
        editKeyboard = {
            inline_keyboard: [
                [{ text: 'Edit username', callback_data: `EUs_${userId}`}],
                [{ text: 'Change Avatar (can be your logo, profile pic, etc)', callback_data: `Av_${userId}`}],
                [{ text: 'Remove Profile Picture', callback_data: `RPfp_${userId}`}],
                [{ text: 'Go back', callback_data: `Upl_${userId}` }],
                [{ text: 'Exit', callback_data: 'exit-payload' }],
            ],
        };
    }

    await ctx.reply(`Edit User - ${ uploader.username } -`, {
		reply_markup: editKeyboard,
	});
}

module.exports = editUserMenuMethod;