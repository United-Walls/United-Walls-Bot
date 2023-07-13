const Uploader = require("../models/Uploader")
const fs = require('fs');

const updateUserMethod = async (ctx, userId) => {
    let chatMember = await ctx.api.getChatMember(-1001437820361, parseInt(userId));
    let userPhotos = await ctx.api.getUserProfilePhotos(parseInt(userId), { limit: 1 });

    console.log(userPhotos);

    let avatarFile = userPhotos.total_count > 0 ? await ctx.api.getFile(userPhotos.photos[0][1].file_id) : undefined;

    console.log(avatarFile);

    if (avatarFile !== undefined) {
        await Uploader.findOneAndUpdate( {userID: userId}, {
            username: chatMember.user.username,
            avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`
        });

        fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}`, { recursive: true }, async (err) => {
            if(err) {
                //note: this does NOT get triggered if the directory already existed
                console.warn(err)

                await ctx.api.sendMessage(
                    -1001731686694,
                    `**Error** - \n\nAvatar did not save ${err}`, { message_thread_id: 77299 }
                );
            }

            fs.rename(avatarFile.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${chatMember.user.username}-Avatar.jpg`, async (err) => {
                if (err) {
                  console.error("Error Found: " + err + "\n\n");
                  await ctx.api.sendMessage(
                    -1001731686694,
                    `**Error** - \n\nAvatar did not save ${err}`,{ message_thread_id: 77299 }
                    );
                } else {
                    await ctx.api.sendMessage(
                        -1001731686694,
                        `**New Avatar** - Avatar saved successfully for user ${chatMember.user.username}.`, { message_thread_id: 77299 }
                    );
                }
            });
        });
    } else {
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
        })
    }

    await ctx.reply('Uploader updated - ' + chatMember.user.username);
}

module.exports = updateUserMethod;