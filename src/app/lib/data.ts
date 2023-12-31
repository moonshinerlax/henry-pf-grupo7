import { sql } from '@vercel/postgres';
import {Products} from './definitions'
export const fetchCache = 'force-no-store';

export async function fetchProduct() {
    
    try {
        const data = await sql<Products>`SELECT * FROM products`;
        return data.rows
    } catch (error) {
        console.log("Database Error:", error)
    }
}

export async function fetchDetailProduct(id:string) {
    try {
      const data = await sql<Products>`SELECT * FROM products WHERE id = ${id}`;
      return data.rows;
    } catch (error) {
      console.log("Database Error:", error);
      throw new Error("Error fetching product details");
    }
  }