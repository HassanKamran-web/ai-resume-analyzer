const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    originalFilename: {
        type: String,
        required: true  
    },
    filePath: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;