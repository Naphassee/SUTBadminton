const mongoose = require('mongoose');

const RegPlayerSchema = new mongoose.Schema({
    // Foriegn Key
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
    manageManaId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManageMana', required: true }
});

module.exports = mongoose.model('RegPlayer', RegPlayerSchema);