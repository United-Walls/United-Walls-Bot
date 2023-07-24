const Uploader = require("../models/Uploader");
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
var fs = require('fs');

const addUploaderIDMethod = async (ctx) => {
    const uploaderID = ctx.update.message.text;

    if (uploaderID != undefined) {
        let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(uploaderID));
        let userPhotos = await ctx.api.getUserProfilePhotos(parseInt(uploaderID), { limit: 1 });

        let avatarFile = userPhotos.total_count > 0 ? await ctx.api.getFile(userPhotos.photos[0][1].file_id) : undefined;

        if (avatarFile) {
            fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}`, { recursive: true }, async (err) => {
                if(err) {
                    //note: this does NOT get triggered if the directory already existed
                    console.warn(err)
    
                    await ctx.api.sendMessage(
                        -1001731686694,
                        `<b>Error</b> - \n\nAvatar did not save \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );
                }
    
                let newUploader = await Uploader.create({
                    userID: parseInt(uploaderID),
                    username: chatMember.user.username,
                    avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${chatMember.user.username}/${uuid}.jpg`,
                    avatar_uuid: uuid,
                    avatar_mime_type: 'image/jpeg'
                });
    
                fs.rename(avatarFile.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${uuid}.jpg`, async (err) => {
                    if (err) {
                      console.error("Error Found: " + err + "\n\n");
                      await ctx.api.sendMessage(
                        -1001731686694,
                        `<b>Error</b> - \n\nAvatar did not save \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                    } else {
                        await ctx.api.sendMessage(
                            -1001731686694,
                            `<b>New Avatar<b> - \n\nAvatar saved successfully for user ${chatMember.user.username}\\.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                    }
                });
            });
        } else {
            let newUploader = await Uploader.create({
                userID: parseInt(uploaderID),
                username: chatMember.user.username,
                avatar_file_url: null,
                avatar_uuid: null,
                avatar_mime_type: null
            });
        }
        await ctx.reply('Uploader added - ' + chatMember.user.username);
    }
}

module.exports = addUploaderIDMethod;