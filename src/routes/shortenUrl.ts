import express, { Request, Response } from 'express';
import pool from '../db';

const shortenUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).send({ message: 'URL is required' });
    }
    const result = await pool.query('INSERT INTO urls (original_url) VALUES ($1) RETURNING *', [url]);
    return res.send({ shortenedUrl: `http://localhost:3000/${result.rows[0].id}` });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

export default shortenUrl;