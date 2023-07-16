const Uploader = require("../models/Uploader")

const removeUploaderPfpMethod = async (ctx, userId) => {
    const beforeDeleteUploader = await Uploader.findOne({userID: userId});
    let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(userId));

    await Uploader.findOneAndUpdate( {userID: userId}, {
        username: chatMember.user.username,
        avatar_file_url: null,
        avatar_uuid: null,
        avatar_mime_type: null
    });

    fs.access(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${beforeDeleteUploader.avatar_uuid}.${beforeDeleteUploader.avatar_mime_type == "image/jpeg" ? "jpg" : "png"}`, async (error) => {
        if (error) {
            return;
        } else {
            fs.unlink(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${beforeDeleteUploader.avatar_uuid}.${beforeDeleteUploader.avatar_mime_type == "image/jpeg" ? "jpg" : "png"}`, (err) => {
                if (err) return;
                console.log(`${chatMember.user.username}'s Previous Avatar was deleted`);
            })
        }
    });

    await ctx.reply('Uploader profile picture removed - ' + chatMember.user.username);
}

module.exports = removeUploaderPfpMethod;