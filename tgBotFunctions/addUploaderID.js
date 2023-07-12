const Uploader = require("../models/Uploader");
var fs = require('fs');

const addUploaderIDMethod = async (ctx) => {
    const uploaderID = ctx.update.message.text;

    if (uploaderID != undefined) {
        let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(uploaderID));
        let userPhotos = await ctx.api.getUserProfilePhotos(parseInt(uploaderID), { limit: 1 });

        console.log(userPhotos.photos);

        let avatarFile = userPhotos.photos.count > 0 ? await ctx.api.getFile(userPhotos.photos[0][1].file_id) : undefined;

        if (avatarFile) {
            fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}`, { recursive: true }, async (err) => {
                if(err) {
                    //note: this does NOT get triggered if the directory already existed
                    console.warn(err)
    
                    await ctx.api.sendMessage(
                        -1001747180858,
                        `**Error** - \n\nAvatar did not save ${err}`
                    );
                }
    
                let newUploader = await Uploader.create({
                    userID: parseInt(uploaderID),
                    username: chatMember.user.username,
                    avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`
                });
    
                fs.rename(avatarFile.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`, async (err) => {
                    if (err) {
                      console.error("Error Found: " + err + "\n\n");
                      await ctx.api.sendMessage(
                        -1001747180858,
                        `**Error** - \n\nAvatar did not save ${err}`
                        );
                    } else {
                        await ctx.api.sendMessage(
                            -1001747180858,
                            `**New Avatar** - Avatar saved successfully for user ${chatMember.user.username}.`
                        );
                    }
                });
            });
        } else {
            let newUploader = await Uploader.create({
                userID: parseInt(uploaderID),
                username: chatMember.user.username
            });
        }
        await ctx.reply('Uploader added - ' + chatMember.user.username);
    }
}

module.exports = addUploaderIDMethod;