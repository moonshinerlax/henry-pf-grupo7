import { sql } from '@vercel/postgres';
import {Products} from './definitions'

export async function postProducts(products: Products[]) {
    try {
      // Insertar productos en la base de datos
    //   const insertedProducts = await sql<Products[]>`
    //   ${sql INSERT INTO Pets (Name, Owner) VALUES (${name}, ${image});`
    
  
    //   console.log('Productos insertados:', insertedProducts);
  
    //   return insertedProducts;
    } catch (error) {
      console.log('Error al insertar productos en la base de datos:', error);
      throw error; // Puedes manejar el error según tus necesidades
    }
  }