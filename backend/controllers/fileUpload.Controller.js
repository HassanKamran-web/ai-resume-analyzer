const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs');
const mammoth = require('mammoth');
const fileUploadRoutes = require('../routes/file.route');
const Resume = require('../models/resume.model');
const OpenAI = require('openai');
const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
});

const uploadresume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }


        const ext = path.extname(req.file.originalname).toLowerCase();

        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdf(dataBuffer);

            const ResumeData = await Resume.create({
                originalFilename: req.file.originalname,
                filePath: req.file.path,
                extractedText: data.text
            });

            return res.status(200).json({
                message: 'File uploaded successfully',
                resumeId: ResumeData._id,
            });

        } else if (ext === '.docx') {

            const result = await mammoth.extractRawText({
                path: req.file.path
            });

            const ResumeData = await Resume.create({
                originalFilename: req.file.originalname,
                filePath: req.file.path,
                extractedText: result.value
            });


            return res.status(200).json({
                message: 'File uploaded successfully',
                resumeId: ResumeData._id,
            });
        }
        else {
            return res.status(400).json({ message: 'Invalid file type. Only PDF and DOCX are allowed.' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

const analyzeResume = async (req, res) => {
    try {
        const resumeId = req.params.id;
        const { jobdescription } = req.body;

        if (!resumeId || !jobdescription) {
            return res.status(400).json({
                message: "Resume ID and job description are required"
            });
        }

        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // 🔥 Strict JSON Prompt
        const prompt = `
You are a professional ATS system.

Compare the resume with the job description.

Return ONLY valid JSON.
Do NOT return explanation or text outside JSON.

Return in this exact structure:
{
  "matchedpercentage": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "suggestions": []
}

Include all technical and soft skills.
Be strict and realistic.

Resume:
${resume.extractedText}

Job Description:
${jobdescription}
`;

        const response = await client.chat.completions.create({
            model: "moonshotai/Kimi-K2-Instruct-0905",
            messages: [{ role: "user", content: prompt }],
        });

        const aiRaw = response.choices[0].message.content.trim();

        // 🔹 Safe JSON parsing (ignore extra text)
        let parsed = { matchedSkills: [], missingSkills: [], suggestions: [] };
        try {
            const jsonStart = aiRaw.indexOf("{");
            const jsonEnd = aiRaw.lastIndexOf("}") + 1;
            const cleanJson = aiRaw.slice(jsonStart, jsonEnd);
            parsed = JSON.parse(cleanJson);
        } catch (err) {
            console.error("Failed to parse AI response as JSON:", err);
            return res.status(500).json({
                message: "Error parsing AI response",
                error: "Invalid JSON format from AI"
            });
        }

        // 🔹 Ensure default arrays
        const matchSkills = parsed.matchedSkills || [];
        const missingSkills = parsed.missingSkills || [];
        const suggestions = parsed.suggestions || [];

        // 🔹 Manual percentage calculation
        const totalSkills = matchSkills.length + missingSkills.length;
        let match = 0;
        if (totalSkills > 0) {
            match = Math.round((matchSkills.length / totalSkills) * 100);
        }

        const deleterewsume = await Resume.findByIdAndDelete(resumeId);
        if (deleterewsume) {
            fs.unlink(deleterewsume.filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }

        return res.status(200).json({
            message: "Resume analyzed successfully",
            match,
            matchSkills,
            missingSkills,
            suggestions
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error analyzing resume",
            error: error.message
        });
    }
};


module.exports = {
    uploadresume,
    analyzeResume
};