const lib = require("./constants");
const logger = require("./logger");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB

process.env.GOOGLE_APPLICATION_CREDENTIALS = "/usr/src/app/src/lustrous-bounty-443706-b7-fc7c62d3c244.json";

// process.env.GOOGLE_APPLICATION_CREDENTIALS = "/home/ubuntu/MaxHome_finial_version/server/src/lustrous-bounty-443706-b7-fc7c62d3c244.json";

app.listen(PORT, () => {
    logger.info(`Server listening on port: ${PORT}`);
});

logger.info('Info-Application started');
logger.error('Error-Application started');

// Chat API - Supports Multiple Users
app.post("/chat", async (request, response) => {
    logger.info("Entering chat endpoint");
    try {
        const { voicemode, userId } = request.body;
        const clientIP = request.headers["x-forwarded-for"] || request.ip || request.connection?.remoteAddress;

        logger.info(`Request from user: ${userId || 'Unknown'} - IP: ${clientIP}`);

        logger.info("request", request);

        // Call chat function
        const resp = await lib.chat(request.body);

        logger.info("Response from chat function: " + JSON.stringify(resp, null, 2));

        if (voicemode && resp) {
            const audioBase64 = await lib.contentExt(resp);
            if (audioBase64.startsWith("Error:")) {
                logger.error("Voice processing error: " + audioBase64);
                return response.status(500).send({ error: "Failed to process voice mode", details: audioBase64 });
            }
            resp.resp_obj.audio = audioBase64;
        }

        response.send(resp);

    } catch (error) {
        logger.error("Error in /chat: " + error.message);
        response.status(500).send({ error: 'Internal server error', details: error.message });
    }
});

// Voice-to-Text API - Supports Multiple Users
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            logger.warn("No file uploaded in /transcribe");
            return res.status(400).send('No file uploaded.');
        }

        logger.info(`Received audio file from user: ${req.headers["user-id"] || "Unknown"}`);

        const transcription = await lib.transcribeAudio(req.file.buffer);
        res.json({ transcription });

    } catch (err) {
        logger.error('Error transcribing audio: ' + err.message);
        res.status(500).send({ error: 'Internal server error', details: err.message });
    }
});