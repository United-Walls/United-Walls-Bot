const Invite = require("../models/Invite");
const Uploader = require("../models/Uploader");

const generateInvitationsMethod = async (ctx) => {
    const numberOfInvitations = isNumeric(ctx.update.message.text) ? parseInt(ctx.update.message.text) : 0;
    const uploader = await Uploader.findOne({ userID: ctx.message.from.id });

    if (numberOfInvitations > 0) {
        if (numberOfInvitations > 1) {
            for(let i = 0; i < numberOfInvitations; i++) {
                await Invite.create({
                    uploader: uploader
                });
            }

            await ctx.reply(`${numberOfInvitations} invitation Codes created, to check invitation codes generated by you, press the menu Command and click on View Generated Codes.`);

            return;
        } else {
            const newInvite = await Invite.create({
                uploader: uploader
            });

            await ctx.reply(`The generated Invite Code is - ${newInvite.token} \n\nit's expiry is - ${newInvite.expiry.toLocaleString()}`);

            return;
        }
    } else {
        await ctx.reply("Error - Could not generate invitation codes. Either you don't know what a number means, or you are just fucking stupid.");

        return;
    }
}

const isNumeric = (value) => {
    return /^-?\d+$/.test(value);
}

module.exports = generateInvitationsMethod;