import express from "express";
import * as dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

dotenv.config();

const router = express.Router();

const hf = new InferenceClient(process.env.STABILITY_AI_TOKEN);

router.route("/").get((req, res) => {
    res.send("Hello from Hugging Face");
});

router.route("/").post(async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required",
            });
        }

        const image = await hf.textToImage({
            model: "black-forest-labs/FLUX.1-schnell",
            inputs: prompt,
        });

        const buffer = Buffer.from(await image.arrayBuffer());
        const base64 = buffer.toString("base64");

        res.status(200).json({
            photo: base64,
            mimeType: image.type || "image/png",
        });

    } catch (error) {
        console.error("Hugging Face Error:", error);

        res.status(500).json({
            message: error?.message || "Image generation failed",
        });
    }
});

export default router;