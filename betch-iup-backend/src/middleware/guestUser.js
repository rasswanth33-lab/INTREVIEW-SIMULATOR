const mongoose = require('mongoose');

// A fixed guest ObjectId used for all unauthenticated requests.
// This keeps the InterviewSession and Answer schemas happy (they require a user field).
const GUEST_ID = new mongoose.Types.ObjectId('000000000000000000000000');

const guestUser = (req, res, next) => {
    req.user = { _id: GUEST_ID };
    next();
};

module.exports = { guestUser };
