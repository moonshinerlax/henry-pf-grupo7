'use client'
import { useState, useEffect } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';


interface Form {
  model: string;
  category: string;
  image: string;
  price: string;
  website: string;
  }

interface Errors {
  model: string;
  category: string;
  image: string;
  price: string;
  website: string;
}

const validation = (form: Form, setErrors: React.Dispatch<React.SetStateAction<Errors>>) => {
  let newErrors: Errors = {
    model: form.model.trim() === '' ? 'Model cannot be empty' : '',
    image: form.image ? '' : "Upload an image",
    category: form.category ?  '' : 'Select a Category',
    price: Number(form.price) > 0 ? '' : 'Price must be a positive number',
    website: /^(http|https):\/\/[^ "]+$/.test(form.website) ? '' : 'Website must be a valid URL',
  };
  setErrors(newErrors);
}

const CreateProduct: React.FC = () => {
  const [form, setForm] = useState<Form>({
    model: '',
    image: '',
    category: '',
     price: '',
    website: '',
  });
  const [errors, setErrors] = useState<Errors>({
    model: '',
    image: '',
    category: '',
    price: '',
    website: '',
  });
  const [formInteracted, setFormInteracted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const property = event.target.name;
    const value = event.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      [property]: value,
    }));

    validation({ ...form, [property]: value }, setErrors);
    setFormInteracted(true);
  };


  const handleImageUpload = (data: any) => {
  
   const  {info} = data
    setForm((prevForm) => ({
          ...prevForm,
         image: info.secure_url,
        }))

                validation({ ...form, image: info.secure_url }, setErrors);
             console.log("url", info.secure_url)
        setFormInteracted(true); 
   }


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
            image: "",
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
  useEffect(() => {
    AOS.init();
  }, []);

 return (
  <>
    <div className="flex flex-col sm:flex-row justify-center bg-gray-500 w-full">
      
      <div className="m-5 text-white w-full sm:mx-10 sm:w-1/3 p-4 bg-gray-800 rounded-md shadow-md items-center gap-5 mb-5 text-black">
        <h1 data-aos="flip-right" className="text-6xl text-gray-100 p-8 text-center">New Product</h1>
        <form onSubmit={handleFormSubmit} className="grid justify-items-center content-evenly gap-y-20">
          <div data-aos="flip-right" className='flex flex-col items-center gap-8 w-full'>
            <label htmlFor="model">Name model:</label> 
            <input
              name="model"
              type="text"
              id="model"
              value={form.model}
              onChange={handleChange}
              className='text-4x1 text-black p-2 w-full sm:w-96 border-gray-500 rounded border-blue-500'
            />  
          </div>
          <div data-aos="flip-right" className='flex justify-center w-full'>
            <CldUploadButton 
              className='w-full border-blue-500 text-4xl rounded border-2 p-8 cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white hover:border-transparent'
              uploadPreset="zwtk1tj5"
              onUpload={handleImageUpload}
            >
              Upload Image
            </CldUploadButton>
          </div>
          {form.image && (
            <div className="flex justify-center w-full">
              <Image 
                src={form.image}
                alt='imagen' 
                width={400}
                height={400}
                className="w-full h-auto transition-transform hover:scale-110" 
                data-aos="flip-right" 
              />
            </div>
          )}
          <div data-aos="flip-right" className='flex flex-col items-center w-full'>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              value={form.category}
              onChange={handleChange}
              className='text-3xl text-black w-full border-blue-500'  
            >
              <option value="All">All</option>
              <option value="Phones">Phones</option>
              <option value="Tablets">Tablets</option>
              <option value="Laptops">Laptops</option>
              <option value="Desktops">Desktops</option>
              <option value="Softwares">Softwares</option>
            </select>
          </div>
          <div data-aos="flip-right" className='flex flex-col items-center gap-2 w-full'>
            <label htmlFor="price">Price:</label>
            <input
              name="price"
              type="text"
              id="price"
              value={form.price}
              onChange={handleChange}
              className='m-1 text-2xl text-black p-2 w-full sm:w-96 border-gray-500 rounded border-blue-500'
            />
          </div>
          <div data-aos="flip-right" className='flex flex-col items-center gap-2 w-full'>
            <label htmlFor="website">Website:</label>
            <input
              name="website"
              type="text"
              id="website"
              value={form.website}
              onChange={handleChange}
              className='m-1 text-2xl text-black p-2 w-full sm:w-96 border-gray-500 rounded border-blue-500'
            />
          </div>
          <div data-aos="flip-right" className="bg-blue-500 text-black p-10 justify-center rounded-md cursor-pointer transition duration-500 hover:bg-white hover:text-blue-500 w-full">
            <button 
              type="submit"
              disabled={ Object.values(errors).some((error) => error !== '')}
              className='border-gray-500 w-full rounded '
            >
              {!form.model || Object.values(errors).some((error) => error !== '') ? 'Cannot Submit - Fix Errors' : 'Add New Product'}
            </button>
          </div>
        </form>
      </div>
      <div className="w-full sm:w-2/4 mx-auto p-5 bg-gray-300 shadow-md text-black">
        {/* Columna lateral */}
    {/* Columna lateral */}
    {formInteracted ? (
      Object.values(errors).some((error) => error !== '') ? (
        <div className='sticky top-0  tw-1/4 mx-auto p-5 bg-gray-600 rounded-md shadow-md text-white'>
          <p>Please correct the following errors:</p>
          <ul className='sticky top-0 ' >
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>
                <span className=" p-4 m-4 p-1 rounded-2xl text-white"> {value ?  "❌ "  + value :  "✅ " + key + ' has been successfully validated' }  </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="sticky top-0  text-black p-3 rounded-md">
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>
                <span className="text-black-200">✅ {key} has been successfully validated </span>
              </li>
            ))}
          </ul> 
 
          <b>Your product is ready to be loaded!</b>
          <div className="text-green-400 font-bold text-5xl mb-2 text-center rounded-full border-2 border-green-400"> ✅</div>
        </div>
      )
    ) : (
      <div className="sticky top-0  tw-1/4 mx-auto p-5 bg-gray-600 rounded-md shadow-md text-white">
        <p>Requirements:</p>
        <ul>
          <li>
            <span className="text-blue-500">Name model</span>  Model cannot be empty 
          </li>
          <li>
            <span className="text-blue-500">Image</span> Upload an image 
          </li>
          <li>
            <span className="text-blue-500">Category</span> Select a Category
          </li>
          <li>
            <span className="text-blue-500">Price </span> must be a positive number
          </li>
          <li>
            <span className="text-blue-500">Website </span> must be a valid URL
          </li>
              
        </ul>

      </div>
    )}
     {form.image ? (
            <div className="fixed  ml-40 mt-1 ">
              <Image 
                src={form.image}
                alt='imagen' 
                width={200}
                height={100}
                className="sticky w-200 h-auto transition-transform hover:scale-110" 
                data-aos="flip-right" 
              />
            </div>): <div> </div> }
  </div>

        
</div>

  </>
);

};

export default CreateProduct;