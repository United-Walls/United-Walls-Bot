const express = require('express');
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const Uploader = require("../../models/Uploader");

// Router -     POST api/creators/profile
// Desc -       Get profile data
// Access -     Private
router.post('/', verifyToken, async(req, res) => {
    try {
        const { 
            username,
            description, 
            twitter, 
            instagram, 
            facebook,
            mastodon,
            threads,
            steam,
            linkedIn,
            link,
            other,
            paypal,
            patreon,
            otherdonations
        } = req.body;
        
        const socialMediaLinks = { twitter, instagram, facebook, mastodon, threads, steam, linkedIn, link, other };

        const donationLinks = { paypal, patreon, otherdonations };

        const updatedUploader = await Uploader.findByIdAndUpdate(req.user.id, { username, description, socialMediaLinks, donationLinks });

        return res.status(201).json({
            username: updatedUploader.username,
            description: updatedUploader.description,
            socialMediaLinks: updatedUploader.socialMediaLinks,
            donationLinks: updatedUploader.donationLinks
        });
    } catch(err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

module.exports = router;