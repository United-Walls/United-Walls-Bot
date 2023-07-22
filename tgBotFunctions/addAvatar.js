const Uploader = require("../models/Uploader");
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
const fs = require('fs');

const addAvatarMethod = async (ctx) => {
    let message = ctx.message

    const dbUploader = await Uploader.findOne({userID: message.from.id});

    if ('document' in message && (message.document?.mime_type == 'image/png' || message.document?.mime_type == 'image/jpg' || message.document?.mime_type == 'image/jpeg')) {
        let uploader = await Uploader.find({userID: message.from.id});

        if (uploader.length > 0) {
            if (message.document?.file_size > 5242880) {
                console.error('File is more than 5MB!');
                await ctx.reply(
                    `Error: Hey, @${message.from.username}, Did you check the Size of this file?\n\nLike dude are you blind or something?\n\nThe limit is not more than 5MB, if it is more than this I wont allow your shitty Huge file dude! Now Fuck off!`
                );
                return;
            }

            try {
                if (!message.document?.file_id) {
                    console.error("File doesn't have an id!");
                    await ctx.reply(
                        `Error: Hey, @${message.from.username}, No ID for file could be fetched, can not save to database.\n\nIt seems like you suck at uploading your own Profile Pic, which is weird because it should be easy to do.`
                    );
                    return;
                }

                let file = await ctx.api.getFile(message.document?.file_id);

                fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${message.from.username}`, { recursive: true }, async (err) => {
                    if(err) {
                        //note: this does NOT get triggered if the directory already existed
                        console.warn(err)
        
                        await ctx.api.sendMessage(
                            -1001731686694,
                            `<b>Error</b> - <br><br>Avatar did not save <br><br><pre>${err}</pre><br><br>for user ${message.from.username} (Folder error)`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                    }
        
                    fs.rename(file.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${message.from.username}/${uuid}.${message.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`, async (err) => {
                        if (err) {
                          console.error("Error Found: " + err + "\n\n");
                          await ctx.api.sendMessage(
                            -1001731686694,
                            `<b>Error</b> - <br><br>Avatar did not save <br><br><pre>${err}</pre><br><br>for user ${message.from.username}`,{ message_thread_id: 77299, parse_mode: 'HTML' }
                            );
                        } else {
                            await ctx.api.sendMessage(
                                -1001731686694,
                                `<b>New Avatar</b> - <br><br>Avatar saved successfully for user ${message.from.username}\\.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                            );
        
                            await ctx.reply('Avatar Picture changed for - ' + message.from.username);

                            await Uploader.findOneAndUpdate( {userID: message.from.id}, {
                                avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${message.from.username}/${uuid}.${message.document?.mime_type == "image/jpeg" ? "jpg" : "png"}`,
                                avatar_uuid: uuid,
                                avatar_mime_type: message.document?.mime_type
                            });
        
                            fs.access(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${message.from.username}/${dbUploader.avatar_uuid}.${dbUploader.avatar_mime_type == "image/jpeg" ? 'jpg' : 'png'}`, async (error) => {
                                if (error) {
                                    return;
                                } else {
                                    fs.unlink(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${message.from.username}/${dbUploader.avatar_uuid}.${dbUploader.avatar_mime_type == "image/jpeg" ? 'jpg' : 'png'}`, (err) => {
                                        if (err) return;
                                        console.log(`${message.from.username}'s Previous Avatar was deleted`);
                                    })
                                }
                            });
                        }
                    });
                });
            } catch (error) {
                console.error(error.message);
                await ctx.reply(
                    `Error: Hey, @${message.from.username}, could not save to Database.\n\nYou've become the greatest and the worst person to do this job, that's saying something!`,
                );
                return;
            }
        }
    }
}

module.exports = addAvatarMethod;