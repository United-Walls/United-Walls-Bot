const bcryptjs = require('bcryptjs');
const Uploader = require('../models/Uploader');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();
var fs = require('fs');

const register = async (ctx) => {
    const uploaderExists = await Uploader.find({ userID: ctx.update.message.from.id });
    let password = ctx.update.message.text;
    const salt = await bcryptjs.genSalt(10);
    password = await bcryptjs.hash(password, salt);

    if (uploaderExists.length > 0) {
        const uploader = await Uploader.findOneAndUpdate({ userID: ctx.update.message.from.id }, { password: password });
    
        await ctx.reply('Registration Successful - ' + uploader.username + '. I hope you remember the password because it\'s really encrypted for us so we do not know. You\'ll need your telegram ID / Username and the Password to login. Your ID is ' + ctx.update.message.from.id + ' and username is ' + uploader.username + '. It is recommended that you delete all chats with this Bot as well.');
    } else {
        let chatMember = await ctx.api.getChatMember(-1001437820361, ctx.update.message.from.id);
        let userPhotos = await ctx.api.getUserProfilePhotos(ctx.update.message.from.id, { limit: 1 });

        let avatarFile = userPhotos.total_count > 0 ? await ctx.api.getFile(userPhotos.photos[0][1].file_id) : undefined;

        if (avatarFile) {
            fs.mkdir(`/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}`, { recursive: true }, async (err) => {
                if(err) {
                    //note: this does NOT get triggered if the directory already existed
                    console.warn(err)
                    await ctx.api.sendMessage(
                        -1001731686694,
                        `<b>Error</b> - \n\nAvatar did not save in storage, because of \n\n${err}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                    );
                }
    
                let newUploader = await Uploader.create({
                    userID: ctx.update.message.from.id,
                    username: chatMember.user.username,
                    avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${chatMember.user.username}/${uuid}.jpg`,
                    password: password,
                    avatar_uuid: uuid,
                    avatar_mime_type: 'image/jpeg'
                });
    
                fs.rename(avatarFile.file_path, `/home/paraskcd/United-Walls-Bot/storage/uploaders/${chatMember.user.username}/${uuid}.jpg`, async (err) => {
                    if (err) {
                        console.error("Error Found: " + err + "\n\n");
                        await ctx.api.sendMessage(
                            -1001731686694,
                            `<b>Error</b> - \n\nAvatar did not save in storage, because of \n\n${err}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                    } else {
                        await ctx.api.sendMessage(
                            -1001731686694,
                            `<b>New Avatar</b> - \n\nAvatar saved successfully for user ${chatMember.user.username}.`, { message_thread_id: 77299, parse_mode: 'HTML' }
                        );
                    }
                });
            });
        } else {
            let newUploader = await Uploader.create({
                userID: ctx.update.message.from.id,
                username: chatMember.user.username,
                password: password,
                avatar_file_url: null,
                avatar_uuid: null,
                avatar_mime_type: null
            });
        }
        await ctx.reply('Registration Successful - ' + chatMember.user.username + '. I hope you remember the password because it\'s really encrypted for us so we do not know. You\'ll need your telegram ID / Username and the Password to login. Your ID is ' + ctx.update.message.from.id + ' and username is ' + chatMember.user.username + '. It is recommended that you delete all chats with this Bot as well.');
    }
    
}

module.exports = register;