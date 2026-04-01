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
    apiKey: process.env.HF_TOKEN,
    baseURL: "https://api.groq.com/openai/v1",
});

const uploadresume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();

        let extractedText = "";

        if (ext === ".pdf") {
            const data = await pdf(req.file.buffer);
            extractedText = data.text;

        } else if (ext === ".docx") {
            const result = await mammoth.extractRawText({
                buffer: req.file.buffer
            });
            extractedText = result.value;

        } else {
            return res.status(400).json({
                message: "Invalid file type. Only PDF and DOCX allowed."
            });
        }

        const ResumeData = await Resume.create({
            originalFilename: req.file.originalname,
            extractedText
        });

        return res.status(200).json({
            message: "File uploaded successfully",
            resumeId: ResumeData._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error uploading file",
            error: error.message
        });
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

        //  Strict JSON Prompt
        const prompt = `
    You are a professional ATS system expert.
    Compare the resume with the job description.

    STRICT RULES:
    1. Return ONLY valid JSON.
    2. suggestions MUST be an array of at least 3 actionable tips to improve the match score.
    3. If the resume is already good, suggest advanced certifications or specific project improvements.

    Return in this exact structure:
    {
    "matchedpercentage": number,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "suggestions": ["suggestion1", "suggestion2"]
    }

    Resume:
    ${resume.extractedText}

    Job Description:
    ${jobdescription}
`;

        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs JSON." },
                { role: "user", content: prompt }
            ],
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

        await Resume.findByIdAndDelete(resumeId);

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