const Uploader = require("../models/Uploader")

const removeUploaderPfpMethod = async (ctx, userId) => {
    let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(userId));

    await Uploader.findOneAndUpdate( {userID: userId}, {
        username: chatMember.user.username,
        avatar_file_url: null
    });

    fs.access(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`, async (error) => {
        if (error) {
            return;
        } else {
            fs.unlink(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`, (err) => {
                if (err) return;
                console.log(`${chatMember.user.username}-Avatar.jpg was deleted`);
            })
        }
    });

    await ctx.reply('Uploader profile picture removed - ' + chatMember.user.username);
}

module.exports = removeUploaderPfpMethod;