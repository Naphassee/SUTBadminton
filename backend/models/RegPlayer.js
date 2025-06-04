const mongoose = require('mongoose');

const RegPlayerSchema = new mongoose.Schema({
    // Foriegn Key
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'ManageMana', required: true }
});

module.exports = mongoose.model('RegPlayer', RegPlayerSchema);