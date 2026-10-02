import { Request, Response } from "express";
import { generateShortCode } from "../utils/generateShortCode";
import pool from "../db/db";

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

    const {
      rows: [newUrl],
    } = await pool.query(
      `INSERT INTO urls (short_code, long_url) VALUES ($1, $2) RETURNING *`,
      [shortCode, url],
    );

    return res.status(201).json({
      id: newUrl.id,
      url: newUrl.long_url,
      shortcode: newUrl.short_code,
      createdAt: newUrl.created_at,
      updatedAt: newUrl.updated_at,
    });
  } catch (error) {
    console.error("Error creating short url: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getOriginalUrl = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({
        error: "shortcode is required",
      });
    }

    const {
      rows: [url],
    } = await pool.query(
      `SELECT long_url FROM urls WHERE short_code = $1 LIMIT 1`,
      [shortCode],
    );

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
};

const updateUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const { shortCode } = req.params;

    if (!url || !shortCode) {
      return res.status(400).json({ error: "url and shortCode are required" });
    }

    const {
      rows: [newUrl],
    } = await pool.query(
      `UPDATE urls SET long_url = $1, updated_at = NOW() WHERE short_code = $2 RETURNING *`,
      [url, shortCode],
    );

    if (!newUrl) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(200).json({
      id: newUrl.id,
      url: newUrl.long_url,
      shortcode: newUrl.short_code,
      createdAt: newUrl.created_at,
      updatedAt: newUrl.updated_at,
    });
  } catch (error) {
    console.error("Error updating short url: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteUrl = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({ error: "shortCode is required" });
    }

    const result = await pool.query(`DELETE FROM urls WHERE short_code = $1`, [
      shortCode,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "url not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting url: ", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getStats = async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({ error: "url is required" });
    }

    const {
      rows: [url],
    } = await pool.query(`SELECT * FROM urls WHERE short_code = $1 LIMIT 1`, [
      shortCode,
    ]);

    if (!url) {
      return res.status(404).json({ error: "url not found" });
    }

    res.status(200).json({
      id: url.id,
      url: url.long_url,
      shortcode: url.short_code,
      createdAt: url.created_at,
      updatedAt: url.updated_at,
      accessCount: url.number_of_visits,
    });
  } catch (error) {
      console.error("Error getting stats: ", error);
      res.status(500).json({
        error: "Internal server error",
      });
  }
};

export { createUrl, getOriginalUrl, updateUrl, deleteUrl, getStats };
