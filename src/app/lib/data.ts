import { sql } from '@vercel/postgres';
import {Products} from './definitions'
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

export async function fetchProduct() {
    
    try {
        const data = await sql<Products>`SELECT * FROM products`;
        return data.rows
    } catch (error) {
        console.log("Database Error:", error)
    }
}

export async function fetchDetailProduct(id) {
    try {
      const data = await sql<Products>`SELECT * FROM products WHERE id = ${id}`;
      return data.rows;
    } catch (error) {
      console.log("Database Error:", error);
      throw new Error("Error fetching product details");
    }
  }