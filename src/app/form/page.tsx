'use client'
import { useState } from 'react';


interface Form {
  model: string;
  category: string;
  price: string;
  website: string;
}

interface Errors {
  model: string;
  category: string;
  price: string;
  website: string;
}

const validation = (form: Form, setErrors: React.Dispatch<React.SetStateAction<Errors>>) => {
  let newErrors: Errors = {
    model: form.model ? '' : 'Este campo es requerido',
    category: form.category !== 'All' ? '' : 'Seleccione una categoría',
    price: form.price ? '' : 'Este campo es requerido',
    website: form.website ? '' : 'Este campo es requerido',
  };}

const CreateProduct: React.FC = () => {
  const [form, setForm] = useState<Form>({
    model: '',
    category: '',
    price: '',
    website: '',
  });
  const [errors, setErrors] = useState<Errors>({
    model: '',
    category: '',
    price: '',
    website: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const property = event.target.name;
    const value = event.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [property]: value,
    }));

    validation({ ...form, [property]: value }, setErrors);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    validation(form, setErrors);

    const hasErrors = Object.values(errors).some((error) => error !== '');

    if (!hasErrors) {
      try {
        let res = await fetch("/api/form", {
          method: "POST",
          body: JSON.stringify({ form }),
        }); 

        const resetForm = () =>
          setForm({
            model: '',
            category: '',
            price: '',
            website: '',
          });
        resetForm();
        window.alert("producto agregado exitosamente")
      } catch (error) {
        window.alert("error al agregar producto")
      }
    } else {
      console.log(errors);
      alert('Por favor, corrige los errores antes de enviar el formulario.');
    }
  };

  return (
    <>
      <div className="mt-5 w-1/2 mx-auto p-5 bg-gray-300 rounded-md shadow-md flex flex-col items-center gap-5 mb-10 text-black">
        <h1 className="text-blue-500">Crear Producto</h1>
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
      <select
        name="category"
        id="category"
        value={form.category}
        onChange={handleChange}
        className={errors.category ? 'border-red-500' : 'border-gray-500'}
      >
        <option value="All">All</option>
        <option value="Phones">Phones</option>
        <option value="Tablets">Tablets</option>
        <option value="Laptops">Laptops</option>
        <option value="Desktops">Desktops</option>
        <option value="Softwares">Softwares</option>
      </select>
            <span>
              {errors.category ? (
                <p className="bg-gray-300 text-red-500">{errors.category}</p>
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