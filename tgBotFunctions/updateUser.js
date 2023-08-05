const Uploader = require("../models/Uploader")
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const fs = require('fs');

const updateUserMethod = async (ctx, messageToUpdate, userId) => {
    const dbUploader = await Uploader.findOne({userID: userId});
    let chatMember = await ctx.api.getChatMember(-1001437820361, userId);
    let userPhotos = await ctx.api.getUserProfilePhotos(userId, { limit: 1 });

    let avatarFile = userPhotos.total_count > 0 ? await ctx.api.getFile(userPhotos.photos[0][1].file_id) : undefined;

    console.log(avatarFile);

    if (avatarFile !== undefined) {
        await Uploader.findOneAndUpdate( {userID: userId}, {
            username: chatMember.user.username,
            avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${chatMember.user.username}/${uuid}.jpg`,
            avatar_uuid: uuid,
            avatar_mime_type: 'image/jpeg'
        });

        fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}`, { recursive: true }, async (err) => {
            if(err) {
                //note: this does NOT get triggered if the directory already existed
                console.warn(err)

                await ctx.api.sendMessage(
                    -1001731686694,
                    `<b>Error</b> - \n\nAvatar did not save \n\n${err}`, { message_thread_id: 77299, parse_mode: 'HTML' }
                );
            }

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
                        `<b>New Avatar</b> - \n\nAvatar saved successfully for user ${chatMember.user.username}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );

                    await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'User updated - ' + chatMember.user.username, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });
                }
            });
        });
    } else {
        await Uploader.findOneAndUpdate( {userID: userId}, {
            username: chatMember.user.username,
            avatar_file_url: null,
            avatar_uuid: null,
            avatar_mime_type: null
        });

        await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, 'User updated without Avatar - ' + chatMember.user.username, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });

        if ('avatar_uuid' in dbUploader && dbUploader.avatar_uuid != null) {
            fs.access(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${dbUploader.avatar_uuid}.${dbUploader.avatar_mime_type == "image/jpeg" ? "jpg" : "png"}`, async (error) => {
                if (error) {
                    return;
                } else {
                    fs.unlink(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${dbUploader.avatar_uuid}.j${dbUploader.avatar_mime_type == "image/jpeg" ? "jpg" : "png"}`, (err) => {
                        if (err) return;
                        console.log(`${chatMember.user.username}'s Previous Avatar was deleted`);
                    })
                }
            });
        }
    }
}

module.exports = updateUserMethod;