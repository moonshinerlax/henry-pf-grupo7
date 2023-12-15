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
    model: form.model ? '' : 'Name required',
    category: form.category !== 'All' ? '' : 'Select a Category',
    price: form.price ? '' : 'Price required',
    website: form.website ? '' : 'Website required',
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
        window.alert("Product succesfully added!")
      } catch (error) {
        window.alert("Error! Product not added")
      }
    } else {
      console.log(errors);
      alert('Please correct the information');
    }
  };

  return (
    <>
      <div className="mt-5 w-1/2 mx-auto p-5 bg-gray-300 rounded-md shadow-md flex flex-col items-center gap-5 mb-10 text-black">
        <h1 className="text-lg font-bold text-gray-900">New Product</h1>
        <form onSubmit={handleFormSubmit} className="grid justify-items-start content-evenly gap-y-2">
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="model">Name model:</label>
            <input
              name="model"
              type="text"
              id="model"
              value={form.model}
              onChange={handleChange}
              className={errors.model ? 'border-red-500 rounded' : 'border-gray-500 rounded'}
            />
            <span>
              {errors.model ? (
                <p className="bg-yellow-300 text-red-500">{errors.model}</p>
              ) : (
                <p> </p>
              )}
            </span>
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="category">Category:</label>
      <select
        name="category"
        id="category"
        value={form.category}
        onChange={handleChange}
        className={errors.category ? 'border-red-500 rounded' : 'border-gray-500 rounded'}
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
                <p> </p>
              )}
            </span>
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="price">Price:</label>
            <input
              name="price"
              type="text"
              id="price"
              value={form.price}
              onChange={handleChange}
              className={errors.price ? 'border-red-500 rounded' : 'border-gray-500 rounded'}
            />
            <span>
              {errors.price ? (
                <p className="bg-yellow-300 text-red-500">{errors.price}</p>
              ) : (
                <p> </p>
              )}
            </span>
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="website">Website:</label>
            <input
              name="website"
              type="text"
              id="website"
              value={form.website}
              onChange={handleChange}
              className={errors.website ? 'border-red-500 rounded' : 'border-gray-500 rounded'}
            />
            <span>
              {errors.website ? (
                <p className="bg-yellow-300 text-red-500">{errors.website}</p>
              ) : (
                <p> </p>
              )}
            </span>
          </div>
          <button type="submit" className="bg-blue-500 text-gray-500 p-2 rounded-md cursor-pointer transition duration-300 hover:bg-brown-500 text-white">
            Add new product.
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;