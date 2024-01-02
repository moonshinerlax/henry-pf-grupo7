// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRouter } from 'next/router';
// import CheckoutWizard from '@/components/CheckOutWizard';
// // import { savePaymentMethod } from '@/redux/slices/cartSlice';
// import { RootState } from '@/redux/store';

// interface PaymentFormData {
//   paymentMethod: string;
// }

// export default function PaymentMethodPage() {
//   const {
//     handleSubmit,
//     register,
//     formState: { errors },
//     setValue,
//   } = useForm<PaymentFormData>();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { shippingAddress } = useSelector(
//     (state: RootState) => state.cart
//   );

//   useEffect(() => {
//     if (!shippingAddress.address) {
//       router.push('/shipping');
//     } else {
//       setValue('paymentMethod', paymentMethod);
//     }
//   }, [paymentMethod, router, setValue, shippingAddress]);

//   const submitHandler = ({ paymentMethod }: PaymentFormData) => {
//     // dispatch(savePaymentMethod(paymentMethod));
//     router.push('/placeorder');
//   };

//   const paymentMethods = ['PayPal', 'Stripe', 'CashOnDelivery'];

//   return (
//     <div>
//       <CheckoutWizard activeStep={2} />
//       <form
//         className="mx-auto max-w-screen-md"
//         onSubmit={handleSubmit(submitHandler)}
//       >
//         <h1 className="mb-4 text-xl">Payment Method</h1>
//         {paymentMethods.map((payment) => (
//           <div key={payment} className="mb-4">
//             <input
//               name="paymentMethod"
//               className="p-2 outline-none focus:ring-0"
//               id={payment}
//               type="radio"
//               value={payment}
//               {...register('paymentMethod', {
//                 required: 'Please select payment method',
//               })}
//             />
//             <label className="p-2" htmlFor={payment}>
//               {payment}
//             </label>
//           </div>
//         ))}
//         {errors.paymentMethod && (
//           <div className="text-red-500 ">{errors.paymentMethod.message}</div>
//         )}
//         <div className="mb-4 flex justify-between">
//           <button type="submit" className="primary-button">
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }