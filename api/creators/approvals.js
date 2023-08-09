const express = require('express');
const router = express.Router();
const verifyToken = require("../../middleware/auth");
const TempWalls = require('../../models/TempWalls');
const Uploader = require('../../models/Uploader');

/*
Route -     GET api/creators/approvals/creator?userId=:userId
Desc -      Get all temp walls of creator
Access -    Public
*/
router.get('/creator', verifyToken, async (req, res) => {
    try {
        const { userId } = req.query;
        const tempWalls = await TempWalls.find().populate({path: 'wall', populate: { path: 'creator', select: "_id" }});
        let userTempWalls = tempWalls.filter((temp) => temp.wall.creator._id == req.user.id);
        return res.status(200).send(userTempWalls);
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
Route -     GET api/creators/approvals/admin
Desc -      Get all walls
Access -    Public
*/
router.get('/admin', verifyToken, async(req, res) => {
    try {
        if (
            req.user.userID === 975024565
            || req.user.userID === 934949695
            || req.user.userID === 1889905927 
            || req.user.userID === 127070302 
        ) {
            const tempWalls = await TempWalls.find().populate('wall');
            return res.status(200).send(tempWalls);
        } else {
            return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!")
        }
    } catch(err) {
        console.error(err);
        TgBot.api.sendMessage(
            -1001731686694,
            `Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
        );
        return res.status(500).send("Something went wrong. Please try again.");
    }
})

module.exports = router;