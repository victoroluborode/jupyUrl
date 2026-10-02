import { Request, Response } from 'express';
import { generateShortCode } from "../utils/generateShortCode";
import pool from '../db/db';

const createUrl = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
          return res.status(400).json({ error: "URL is required" });
        }

        let shortCode = generateShortCode();

        while (true) {
            const result = await pool.query(
              `SELECT 1 FROM urls WHERE short_code = $1 LIMIT 1`,
              [shortCode],
            );

            if (result.rowCount === 0) {
                break;
            }

            shortCode = generateShortCode();
        }

        const { rows: [newUrl] } = await pool.query(`INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *`, [shortCode, url]);
        
        return res.status(201).json({
            id: newUrl.id,
            url: newUrl.long_url,
            shortcode: newUrl.short_code,
            createdAt: newUrl.created_at,
            updatedAt: newUrl.updated_at
        });
    } catch (error) {
        console.error("Error creating short url: ", error)
        res.status(500).json({
            error: "Internal server error"
        })
    }
}

const getOriginalUrl = async (req: Request, res: Response) => {
    try {
        const { shortCode } = req.params;
        
        if (!shortCode) {
            return res.status(400).json({
                error: "shortcode is required"
            });
        }

        const { rows: [url] } = await pool.query(`SELECT long_url FROM urls WHERE short_code = $1 LIMIT 1`, [shortCode]);

        if (!url) {
          return res.status(404).json({ error: "Short URL not found" });
        }

        await pool.query(
          `UPDATE urls SET number_of_visits = number_of_visits + 1 WHERE short_code = $1`,
          [shortCode],
        );

        return res.redirect(302, url.long_url);
    } catch (error) {
        console.error("Error redirecting:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export { createUrl, getOriginalUrl };