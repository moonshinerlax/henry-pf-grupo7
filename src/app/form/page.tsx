
'use client'
import React, { useState, useEffect, FC } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import Swal from 'sweetalert2'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';


interface Specs {
    [key: string]: any; 
}

interface Form {
  model: string;
  category: string;
  image: string;
  price: string;
  specs: Specs;
  }

interface Errors {
  model: string;
  category: string;
  image: string;
  price: string;
  specs: string;
}


const validation = (form: Form, setErrors: React.Dispatch<React.SetStateAction<Errors>>) => {
  let newErrors: Errors = {
    model: form.model.trim() === '' ? 'Model cannot be empty' : '',
    image: form.image ? '' : "upload an Image",
    category: form.category ?  '' : 'select a Category',
    price: Number(form.price) > 0 ? '' : 'Price must be a positive number',
    specs: Object.keys(form.specs).length > 0 ? "" :  "Specs must not be empty",
  };
  setErrors(newErrors);
}


const CreateProduct: FC = () => {

const router = useRouter()


  const [form, setForm] = useState<Form>({
    model: '',
    image: '',
    category: '',
     price: '',
    specs: {},
  });

  const [errors, setErrors] = useState<Errors>({
    model: '',
    image: '',
    category: '',
    price: '',
    specs: "",
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

  const handleSpecsChange = (newSpecs: { property: string; value: any }) => {
    
    
    const property = newSpecs.property;
    const value = newSpecs.value;
        
    setForm((prevForm) => ({
      ...prevForm,
      specs: {
        ...prevForm.specs,
        [newSpecs.property]: newSpecs.value,
      },
    }));  
    validation({ ...form, specs: { ...form.specs, [property]: value } }, setErrors);
  };

const [key, setKey] = useState("");
const [value, setValue] = useState("");

const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setKey(event.target.value);
};

const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

const handleAddSpec = () => {
  handleSpecsChange({ property: key, value: value });
  setKey("");
  setValue("");
};


  const handleImageUpload = (data: any) => {
  
   const  {info} = data
    setForm((prevForm) => ({
          ...prevForm,
         image: info.secure_url,
        }))

      validation({ ...form, image: info.secure_url }, setErrors);
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
  
        if (!res.ok) {
          throw new Error(res.statusText);
        }
   const id= (await res.json()).id;

        const resetForm = () =>
          setForm({
            model: '',
            image: "",
            category: '',
            price: '',
            specs: {specifications: ""},
          });
        resetForm();

        Swal.fire({
          title: 'Add New Product',
          html: `Product successfully created!`,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            // window.location.href = `/product/${id}`;
            router.push(`/product/${id}`)
          }
        });


      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Product not added",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      console.log(errors);
      Swal.fire({
        title: "Error!",
        text: 'Please correct the information',
        icon: "error",
        confirmButtonText: "OK",

      } );
    }
  };
  
  useEffect(() => {
    AOS.init();
  }, []);
console.log(form)
 return (
  <>
    <div className="flex flex-col sm:flex-row justify-center bg-gray-500 w-full mb-32">
      
      <div className="m-6  mx-4 w-auto sm:mx-10 sm:w-2/3 p-4 bg-black rounded-md shadow-md items-center gap-5 mb-50 text-gray-300 ">
        <h1 data-aos="flip-right" className="text-2xl text-gray-300 p-20 text-center"> Add New Product</h1>
        <form onSubmit={handleFormSubmit} className="grid justify-items-center content-evenly gap-y-20">
         <div data-aos="flip-right" className='flex flex-col items-center gap-2 w-full'>
           <label htmlFor="model">Name model:</label> 
           <input
              name="model"
              type="text"
              id="model"
              placeholder='Enter a Name Model...'
              value={form.model}
              onChange={handleChange}
              className='m-1 text-2xl text-black p-2 w-full  border-gray-500 rounded'
            />  
          </div>
          <div data-aos="flip-right" className='flex justify-center w-full'>
            <CldUploadButton 
              className='w-full border-blue-500 text-normal rounded border-2 p-8 cursor-pointer transition duration-300 hover:bg-blue-500 hover:text-white hover:border-transparent'
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
                width={200}
                height={200}
                className="w-60 h-auto transition-transform rounded-2xl hover:scale-110" 
                data-aos="flip-right" 
              />
            </div>
          )}
          <div data-aos="flip-right" className='flex flex-col items-center w-full'>
            <label htmlFor="category">Category:</label>
            <select
              name="category"
              id="category"
              placeholder='Select a Category'
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
              placeholder='Type a number for the Price...'
              value={form.price}
              onChange={handleChange}
              className='m-1 text-2xl text-black p-2 w-full  border-gray-500 rounded'
            />
          </div>
          
 <div data-aos="flip-right" className='flex flex-col items-center gap-2 w-full'>
       <label htmlFor="key">Spec</label>
  <input
    onChange={handleKeyChange}
    name="key"
    id="key"
    placeholder='Enter a specificification'
    value={key}
    className='m-1 text-2xl text-black p-2 w-full border-blue-500 rounded'
  />

  <label htmlFor="value">Desciption</label>
  <input
    onChange={handleValueChange}
    name="value"
    id="value"
    placeholder='Enter description'
    value={value}
    className='m-1 text-2xl text-black p-2 w-full border-blue-500 rounded'
  />

<button  type="button" onClick={handleAddSpec} className='m-1 text-2xl text-gray-800 p-2 w-full border-blue-100 bg-blue-300 rounded'>
    Add Spec
  </button>
</div>
<div>
<div data-aos="flip-right" className='text-6xl p-3  flex-initial'  >Specs:</div>
  {Object.entries(form.specs).map(([key, value], index) => (
    <>
 
    <div data-aos="flip-right"  key={index} className='m-1 text-2xl text-gray-200 p-2 w-full border-blue-500 rounded'>
      <strong  >{key}:</strong> {value}
    </div>
    </>
  ))}
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
    {formInteracted ? (
      Object.values(errors).some((error) => error !== '') ? (
        <div className="sticky top-20  h-full p-12 text-sm text-gray-400 md:tw-1/2 tw-1/4 mx-auto p-15 bg-black rounded-md shadow-md ">
         <p>Please correct the following requirements:</p>
          <ul className='sticky top-12 h-auto ' >
            {Object.entries(errors).map(([key, value]) => (
              <li className= "p-5" key={key}>
                <span className=" rounded-md shadow-md "> {value ?  "❌ "  + value :  "✅ " + key.charAt(0).toUpperCase() + key.slice(1) + ' has been successfully validated' }  </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="sticky top-12  h-auto text-sm  md:tw-1/2 tw-1/4 mx-auto p-8 bg-black rounded-md shadow-md text-gray-400 ">

          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li className="p-5" key={key}>
                <span className="text-gray-400">✅ {key.charAt(0).toUpperCase() + key.slice(1)} has been successfully validated </span>
              </li>
            ))}
          </ul> 
            <div className="text-gray-200 p-5  text-sm rounded-full "> ✅
           <b>Your product is ready to be loaded!</b></div>
          </div>
      )
    ) : (
      <div className="sticky top-20  h-auto text-base text-gray-400 md:tw-1/2 tw-1/4 mx-auto p-5 bg-black rounded-md shadow-md ">
        <p>Requirements:</p>
        <ul>
          <li className='p-5 '>
            <span className="text-blue-500 ">Name model:</span> enter a valid model name. 
          </li>
          <li className='p-5 '>
            <span className="text-blue-500">Image:</span> add an Image from multiple sources. 
          </li>
          <li className='p-5 '>
            <span className="text-blue-500">Category:</span> add a category for your created product.
          </li>
          <li className='p-5 '>
            <span className="text-blue-500">Price: </span> define the price of the product with a positive number.
          </li>
          <li className='p-5 '>  
            <span className="text-blue-500">Specs:</span> detail the Specifications of the created product
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