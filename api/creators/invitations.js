const express = require('express');
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Invite = require('../../models/Invite');

/*
Route -     GET api/creators/invitations/admin
Desc -      Generate Invites
Access -    Private
*/
router.get('/admin', verifyToken, async (req, res) => {
    try {
        if (
            req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302 
        ) {
            const invitations = await Invite.find();
            return res.status(200).send(invitations);
        } else {
            return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!");
        }
    } catch(err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

/*
Route -     POST api/creators/invitations/admin
Desc -      Generate Invites
Access -    Private
*/
router.post('/admin', verifyToken, async (req, res) => {
    try {
        if (
            req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302 
        ) {
            const isNumeric = (value) => {
                return /^-?\d+$/.test(value);
            }

            let { invites } = req.body;
            
            if (isNumeric(invites)) {
                invites = parseInt(invites);
            }

            let invitations = [];

            if (invites > 0) {
                for(let i = 0; i < numberOfInvitations; i++) {
                    const invitation = await Invite.create({
                        uploader: uploader
                    });
                    invitations.push(invitation);
                }

                return res.status(201).send(invitations);
            } else {
                return res.status(400).send("Invalid Number");
            }
        } else {
            return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!");
        }
    } catch(err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

module.exports = router;