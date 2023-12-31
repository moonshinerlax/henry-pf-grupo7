'use client'
import { useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';


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
    model: /^[0-9]+$/.test(form.model) ? 'Model cannot be a number' : '',
    category: form.category !== 'All' ? '' : 'Select a Category',
    price: /^[0-9]+$/.test(form.price) ? '' : 'Price must be a number',
    website: /^(www\.|http:\/\/|https:\/\/)/.test(form.website) ? '' : 'Website must start with www., http://, or https://',
  };

  setErrors(newErrors);
}

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
    <div className="flex">
      <div className="mt-5 w-2/3 mx-auto p-6 bg-gray-300 rounded-md shadow-md flex flex-col items-center gap-5 mb-5 text-black">
        <h1 className="text-lg font-bold text-gray-900">New Product</h1>
        <form onSubmit={handleFormSubmit} className="grid justify-items-start content-evenly gap-y-2">
          <div className= 'flex justify-around items-center flex-column gap-2'>
            <label htmlFor="model">Name model:</label> 
            <input
              name="model"
              type="text"
              id="model"
              value={form.model}
              onChange={handleChange}
              className='border-gray-500 rounded'
            />  
            <div></div>
            <div>
          
            </div>
          </div>
          <div className= 'flex justify-self-center'>
            <CldUploadButton 
              className='border-blue-500 rounded border-2 p-1 cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white hover:border-transparent'
              uploadPreset="subir"
            >Upload Image </CldUploadButton>
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              className='border-gray-500 rounded'
            >
              <option value="All">All</option>
              <option value="Phones">Phones</option>
              <option value="Tablets">Tablets</option>
              <option value="Laptops">Laptops</option>
              <option value="Desktops">Desktops</option>
              <option value="Softwares">Softwares</option>
            </select>
        
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="price">Price:</label>
            <input
              name="price"
              type="text"
              id="price"
              value={form.price}
              onChange={handleChange}
              className='border-gray-500 rounded'
            />
       
          </div>
          <div className= 'flex justify-around items-center flex-row gap-2'>
            <label htmlFor="website">Website:</label>
            <input
              name="website"
              type="text"
              id="website"
              value={form.website}
              onChange={handleChange}
              className= 'border-gray-500 rounded'
            />
         
          </div>
          <button
  type="submit"
  className="bg-blue-500 text-gray-500 p-5 rounded-md cursor-pointer transition duration-300 hover:bg-brown-500 text-white"
  disabled={Object.values(errors).some((error) => error !== '')}
>
  {Object.values(errors).some((error) => error !== '') ? 'Cannot Submit - Fix Errors' : 'Add New Product'}
</button>
        </form>
      </div>
      
      <div className="w-1/4 mx-auto p-5 bg-gray-300 rounded-md shadow-md text-black">
        {/* Columna lateral */}

        {Object.values(errors).some((error) => error !== '') ? (
  <div className=" text-black p-3 rounded-md">
    <p>Please correct the following errors:</p>
    <ul>
      {Object.entries(errors).map(([key, value]) => (
        <li key={key}>
          <span className="text-black-500"> {value ?  "❌ "  + value :  "✅ " + key }  </span>
        </li>
      ))}
    </ul>
  </div>
) : (
  <div className="text-black p-3 rounded-md">
    <p>Requirements:</p>
    <ul>
      <li>
        <span className="text-blue-500">Name model</span>  Model cannot be a number 
      </li>
      <li>
        <span className="text-blue-500">Category</span> Select a Category
      </li>
      <li>
        <span className="text-blue-500">Price </span> must be a number
      </li>
      <li>
        <span className="text-blue-500">Website </span> must start with www., http://, or https://
      </li>
    </ul>
  </div>
)}
  </div>
    </div>

  </>
);

};

export default CreateProduct;