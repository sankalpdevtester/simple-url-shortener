import express, { Request, Response } from 'express';
import pool from '../db';

const redirect = async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const id = shortUrl.split('/').pop();
    const result = await pool.query('SELECT original_url FROM urls WHERE id = $1', [id]);
    if (!result.rows[0]) {
      return res.status(404).send({ message: 'URL not found' });
    }
    return res.redirect(result.rows[0].original_url);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

export default redirect;