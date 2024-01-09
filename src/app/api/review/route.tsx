import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    interface Review {
        productId: string;
        userId: number;
        rating: number;
        review: string;
    }
    
    interface RequestBody {
        review: Review;
    }

    const client = await db.connect();

    if (req.method === 'GET') {
        const productId = req.query.productId as string;
        try {
            const result = await client.sql`SELECT * FROM reviews WHERE product_id = ${productId}`;
            res.status(200).json(result.rows);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    } else if (req.method === 'POST') {
        const { review }: RequestBody = req.body;
        try {
            await client.sql`
                INSERT INTO reviews (product_id, user_id, rating, review) 
                VALUES (${review.productId}, ${review.userId}, ${review.rating}, ${review.review})
            `;
            res.status(200).json({ message: 'Reseña agregada con éxito.' });
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;

