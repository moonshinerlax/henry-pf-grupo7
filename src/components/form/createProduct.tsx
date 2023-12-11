import { postProducts } from '@/app/lib/post';
import Products from '@/app/product/page';
import { sql } from '@vercel/postgres';
import { useState } from 'react';


interface Form {
  model: string;
  category: string;
  platform: string;
  description: string;
  image: string;
  price: string;
  website: string;
}

interface Errors {
  model: string;
  category: string;
  platform: string;
  description: string;
  image: string;
  price: string;
  website: string;
}

const validation = (form: Form, setErrors: React.Dispatch<React.SetStateAction<Errors>>, errors: Errors) => {
  if (!form.model) errors.model = 'Este campo es requerido';
  else errors.model = '';

  if (!form.category) errors.category = 'Este campo es requerido';
  else errors.category = '';

  if (!form.platform) errors.platform = 'Este campo es requerido';
  else errors.platform = '';

  if (!form.description) errors.description = 'Este campo es requerido';
  else errors.description = '';

  if (!form.image) errors.image = 'Este campo es requerido';
  else errors.image = '';

  if (!form.price) errors.price = 'Este campo es requerido';
  else errors.price = '';

  if (!form.website) errors.website = 'Este campo es requerido';
  else errors.website = '';
};

const CreateProduct: React.FC = () => {
  const [form, setForm] = useState<Form>({
    model: '',
    category: '',
    platform: '',
    description: '',
    image: '',
    price: '',
    website: '',
  });

  const [errors, setErrors] = useState<Errors>({
    model: '',
    category: '',
    platform: '',
    description: '',
    image: '',
    price: '',
    website: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const property = event.target.name;
    const value = event.target.value;

    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [property]: value };

      validation(updatedForm, (newErrors) => setErrors(newErrors), errors);

      return updatedForm;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validation(form, (newErrors) => setErrors(newErrors), errors);

    const hasErrors = Object.values(errors).some((error) => error !== '');

    if (!hasErrors) {
      try {
        const { model, category, platform, description, image, price, website } = form;

              await sql
                      `<Products> 
        INSERT INTO products (model, category, platform, description, image, price, website)
          VALUES (${model}, ${category}, ${platform}, ${description}, ${image}, ${price}, ${website})
         ` ;

        // Limpiar el formulario después de enviar
        const resetForm = () =>
          setForm({
            model: '',
            category: '',
            platform: '',
            description: '',
            image: '',
            price: '',
            website: '',
          });
        resetForm();

        // Mostrar mensaje de éxito
        alert( `  El producto ${model} se ha creado exitosamente ` );
      } catch (error) {
        console.error('Error al crear el producto:' );
        alert('Hubo un error al crear el producto.');
      }
    } else {
      console.log(errors);
      alert('Por favor, corrige los errores antes de enviar el formulario.');
    }
  };

  return (
    <>
      <div className="mt-5 w-1/2 mx-auto p-5 bg-yellow-300 rounded-md shadow-md flex flex-col items-center gap-5 mb-10">
        <h1 className="text-green-500">Crear Producto</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="model">Modelo:</label>
            <input
              name="model"
              type="text"
              id="model"
              value={form.model}
              onChange={handleChange}
              className={errors.model ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.model ? (
                <p className="bg-yellow-300 text-red-500">{errors.model}</p>
              ) : (
                <p >No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="category">Categoría:</label>
            <input
              name="category"
              type="text"
              id="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.category ? (
                <p className="bg-yellow-300 text-red-500">{errors.category}</p>
              ) : (
                <p >No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="platform">Plataforma:</label>
            <input
              name="platform"
              type="text"
              id="platform"
              value={form.platform}
              onChange={handleChange}
              className={errors.platform ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.platform ? (
                <p className="bg-yellow-300 text-red-500">{errors.platform}</p>
              ) : (
                <p>No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="description">Descripción:</label>
            <input
              name="description"
              type="text"
              id="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.description ? (
                <p className="bg-yellow-300 text-red-500">{errors.description}</p>
              ) : (
                <p >No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="image">Imagen (URL):</label>
            <input
              type="url"
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              className={errors.image ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.image ? (
                <p className="bg-yellow-300 text-red-500">{errors.image}</p>
              ) : (
                <p >No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="price">Precio:</label>
            <input
              name="price"
              type="text"
              id="price"
              value={form.price}
              onChange={handleChange}
              className={errors.price ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.price ? (
                <p className="bg-yellow-300 text-red-500">{errors.price}</p>
              ) : (
                <p >No hay errores</p>
              )}
            </span>
          </div>
          <div>
            <label htmlFor="website">Sitio Web:</label>
            <input
              name="website"
              type="text"
              id="website"
              value={form.website}
              onChange={handleChange}
              className={errors.website ? 'border-red-500' : 'border-gray-500'}
            />
            <span>
              {errors.website ? (
                <p className="bg-yellow-300 text-red-500">{errors.website}</p>
              ) : (
                <p>No hay errores</p>
              )}
            </span>
          </div>
          <button type="submit" className="bg-green-500 text-gray-500 p-2 rounded-md cursor-pointer transition duration-300 hover:bg-brown-500">
            Crear Producto
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
