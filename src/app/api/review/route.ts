// import { v4 as uuidv4 } from 'uuid';
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const requestBody = await req.json();
//     console.log(requestBody); // Imprime el cuerpo de la solicitud

//     const { productId, rating, review} = requestBody;

//     // Genera un ID único para la reseña
//     const id = uuidv4();

//     // Guarda los datos en la base de datos
//     console.log({id, productId, rating, review}); //  agregar la lógica para guardar los datos en la base de datos o realizar alguna acción adicional.

//     return NextResponse.json({ status: "success", message: "Reseña guardada" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: "error", message: "Ocurrió un error al procesar la solicitud" });
//   }
// }
import { v4 as uuidv4 } from 'uuid';
import { NextResponse, NextRequest } from "next/server";
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    console.log(requestBody); // Imprime el cuerpo de la solicitud

// de aca para adelante es prueba
    const { productId, rating, review} = requestBody;

    // Genera un ID único para la reseña
    const id = uuidv4();

    // Guarda los datos en la base de datos
    console.log({id, productId, rating, review}); //  agregar la lógica para guardar los datos en la base de datos o realizar alguna acción adicional.

    // Define la ruta del archivo
    const filePath = path.join(process.cwd(), 'data.json'); // Cambia 'data.json' por la ruta donde quieres guardar el archivo

    let data = [];

    // Comprueba si el archivo existe antes de intentar leerlo
    if (fs.existsSync(filePath)) {
      // Si el archivo existe, lee el archivo JSON existente
      const rawData = fs.readFileSync(filePath).toString();
      if (rawData) {
        data = JSON.parse(rawData);
      }
    }

    // Agrega los nuevos datos al final del archivo
    data.push({id, productId, rating, review});

    // Vuelve a escribir el archivo con los nuevos datos
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return NextResponse.json({ status: "success", message: "Reseña guardada" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", message: "Ocurrió un error al procesar la solicitud" });
  }
}










interface Review {
  id: string;
  productId: string;
  rating: number;
  review: string;
}

export async function GET(req: NextRequest) {
  try {
    // Obtiene el id de la URL de la solicitud
    const id = req.nextUrl.searchParams.get('id');

    // Define la ruta del archivo
    const filePath = path.join(process.cwd(), 'data.json'); // Cambia 'data.json' por la ruta donde tienes guardado el archivo

    // Lee el archivo JSON existente
    const rawData = fs.readFileSync(filePath).toString();
    const data: Review[] = JSON.parse(rawData);

    // Filtra los objetos que coincidan con el id
    const matchingObjects = data.filter((item: Review) => item.productId === id);
    console.log(matchingObjects); // Imprime los objetos coincidentes en la consola
    return NextResponse.json({ status: "success", data: matchingObjects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "error", message: "Ocurrió un error al procesar la solicitud" });
  }
}
