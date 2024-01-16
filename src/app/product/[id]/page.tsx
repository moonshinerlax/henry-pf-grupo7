import { fetchDetailProduct } from "../../lib/data";
import Image from "next/image";
import { AddToCart } from "@/components/AddToCart";
import ReviewForm from "@/components/RatingReview/ReviewForm";
import ReviewsList from "@/components/RatingReview/Rating";
import AverageRatingStars from "@/components/RatingReview/AverageRating";


export default async function Detail({ params }: { params: { id: string } }) {
  const product = await fetchDetailProduct(params.id);
  const productDetail = product[0];

  if (!productDetail) {
    return <div>Product not found!</div>;
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-4">
      <section className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className=" p-16">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Image
              src={productDetail.image}
              alt={productDetail.model}
              width={600}
              height={600}
              className="rounded"
            />
            <div className="flex flex-row m-2 gap-2">
              {productDetail.carrusel
                ? Object.entries(productDetail.carrusel).map(([key, value]) => (
                    <div key={key}>
                      <Image
                        className=" rounded-md"
                        src={value}
                        width={100}
                        height={100}
                        alt={key}
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
            <h1 className="mb-2 text-5xl font-medium">{productDetail.model}</h1>
            <h2>{productDetail.category}</h2>
            <AverageRatingStars />
            <div className="my-6 mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
              <p>${productDetail.price} USD</p>
            </div>
            <div className="flex flex-col justify-center text-xl p-2 rounded-2xl">
              <AddToCart
                buttonStyle="p-4 text-base"
                stock={40}
                productId={productDetail.id}
                showQty={false}
                product={productDetail}
                increasePerClick={true}
                redirect={false}
              />
            </div>
          </div>
          <div>
            {productDetail.website ? (
              <a href={productDetail.website}>
                Website: {productDetail.website}
              </a>
            ) : null}
            <h1 className="text-2xl font-bold">Specs:</h1>
            {productDetail.specs
              ? Object.entries(productDetail.specs).map(([key, value]) => (
                  <div key={key}>
                    <h1 className="font-bold">{key}:</h1>
                    <h1>{value}:</h1>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12  lg:gap-8 ">
          <p>Resenas de productos</p>
          <ReviewsList />
        </div>
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-black md:p-12  lg:gap-8 ">
          <p>Escriba una Resena</p>
          <ReviewForm productId={productDetail.id} />
        </div>
      </section>
    </main>
  );
}
