'use client'
import CheckoutWizard from '@/components/CheckOutWizard';
import { saveShippingAddress } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface FormData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    // other properties...
  }

export default function ShippingAddressPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = (data: ShippingAddress) => {
    dispatch(
      saveShippingAddress(data)
    );
    router.push('/payment');
  };

  return (
    <div>
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md text-gray-300"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl ">Shipping Address</h1>
        <div className="mb-4 ">
          <label htmlFor="fullName">Full Name</label>
          <input
            className="w-full text-gray-300 bg-transparent border-gray-400 border rounded-md"
            id="fullName"
            autoFocus
            {...register('fullName', {
              required: 'Please enter full name',
            })}
          />
          {errors.fullName && (
            <div className="text-red-500 text-sm">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4 text-gray-300">
          <label htmlFor="address">Address</label>
          <input
            className="w-full text-gray-300 bg-transparent border-gray-400 border rounded-md"
            id="address"
            {...register('address', {
              required: 'Please enter address',
              minLength: {
                value: 3,
                message: 'Address is more than 2 chars',
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500 text-sm">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            className="w-full text-gray-300 bg-transparent border-gray-400 border rounded-md"
            id="city"
            {...register('city', {
              required: 'Please enter city',
            })}
          />
          {errors.city && (
            <div className="text-red-500 text-sm">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className="w-full text-gray-300 bg-transparent border-gray-400 border rounded-md"
            id="postalCode"
            {...register('postalCode', {
              required: 'Please enter postal code',
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500 text-sm">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            className="w-full text-gray-300 bg-transparent border-gray-400 border rounded-md"
            id="country"
            {...register('country', {
              required: 'Please enter country',
            })}
          />
          {errors.country && (
            <div className="text-red-500 text-sm">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button bg-blue-500 rounded-md w-14 text-white">Next</button>
        </div>
      </form>
    </div>
  )
}