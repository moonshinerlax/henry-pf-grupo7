const { db } = require('@vercel/postgres');
const appledb = require('../src/app/lib/appledb.json');


async function clearProductsTable() {
    try {
      await db.query('TRUNCATE TABLE products');
      
      
      console.log('Products table cleared successfully!');
    } catch (error) {
      console.error('Error clearing products table:', error);
    }
  }

async function seedProducts(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS products (
        
        model VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        specs JSONB,
        image VARCHAR(255) NOT NULL,
        colors TEXT[],
        price VARCHAR(255) NOT NULL,
        carrusel JSONB,
        video VARCHAR(255),
        website VARCHAR(255)
      );
    `;

    console.log(`Created "products" table`);

   await clearProductsTable()

    // Insert data into the "users" table
    const insertedProducts = await Promise.all(
      appledb.map(async (product) => {
        return client.sql`
        INSERT INTO products (model, category, specs, image, colors, price, carrusel, video, website)
        VALUES (${product.model}, ${product.category}, ${product.specs}, ${product.img_url}, ${product.colors}, ${product.price}, ${product.img_carrusel}, ${product.video}, ${product.website})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedProducts.length} products`);

    return {
      createTable,
      products: insertedProducts,
    };
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedProducts(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});