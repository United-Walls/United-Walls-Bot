const Uploader = require("../models/Uploader")
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const fs = require('fs');

const updateUserMethod = async (ctx, userId) => {
    const dbUploader = await Uploader.findOne({userID: userId});
    let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(userId));
    let userPhotos = await ctx.api.getUserProfilePhotos(parseInt(userId), { limit: 1 });

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
                    `<b>Error</b> - <br><br>Avatar did not save <br><br><pre>${err}</pre>`, { message_thread_id: 77299, parse_mode: 'HTML' }
                );
            }

            fs.rename(avatarFile.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${uuid}.jpg`, async (err) => {
                if (err) {
                    console.error("Error Found: " + err + "\n\n");
                    await ctx.api.sendMessage(
                        -1001731686694,
                        `<b>Error</b> - <br><br>Avatar did not save <br><br><pre>${err}</pre>`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );
                } else {
                    await ctx.api.sendMessage(
                        -1001731686694,
                        `<b>New Avatar</b> - <br><br>Avatar saved successfully for user ${chatMember.user.username}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );

                    await ctx.reply('Avatar Picture changed for - ' + chatMember.user.username);

                    fs.access(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${dbUploader.avatar_uuid}.jpg`, async (error) => {
                        if (error) {
                            return;
                        } else {
                            fs.unlink(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${dbUploader.avatar_uuid}.jpg`, (err) => {
                                if (err) return;
                                console.log(`${chatMember.user.username}'s Previous Avatar was deleted`);
                            })
                        }
                    });
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

        await ctx.reply('Could not find Avatar Picture for - ' + chatMember.user.username + '. Make sure to your privacy settings allow to upload your Profile Picture to our database, or you can just use our Bot to upload a Profile Pic.');

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

    await ctx.reply('Uploader updated - ' + chatMember.user.username);
}

module.exports = updateUserMethod;