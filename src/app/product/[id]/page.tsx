"use client";
import { fetchDetailProduct } from "../../lib/data";
import Image from "next/image";
import { AddToCart } from "@/components/AddToCart";
import ReviewsList from "@/components/RatingReview/Rating";
import AverageRatingStars from "@/components/RatingReview/AverageRating";
import { useEffect, useState } from "react";
import ReviewForm from "@/components/RatingReview/ReviewForm";

interface Detail {
  id: string;
  model: string;
  category: string;
  specs: any;
  image: string;
  colors: string;
  price: string;
  carrusel: any;
  video: string;
  website: string;
}

export default function Detail({ params }: { params: { id: string } }) {
  const [productDetail, setProductDetail] = useState<any>();
  const [currentImage, setCurrentImage] = useState<string>("");
  const [video, setVideo] = useState<boolean>(true);

  const fetchDetail = async () => {
    try {
      const response = await fetch(`/api/detail?id=${params.id}`);
      if (response.ok) {
        const products = await response.json();
        setProductDetail(products.products[0]);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const handleImageChange = (newImage: string) => {
    setVideo(false);
    setCurrentImage(newImage);
  };

  if (!productDetail) {
    return <div>Product not found!</div>;
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-4">
      <section className="flex flex-col rounded-lg borderp-8 border-neutral-800 bg-black md:p-12 lg:flex-row lg:gap-8">
        <div className="w-1/2 p-16">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <div className="h-96 ">
              {productDetail.video && video ? (
                <video width={600} height={400} autoPlay={true}>
                  <source src={productDetail.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={currentImage ? currentImage : productDetail.image}
                  alt={productDetail.model}
                  width={400}
                  height={400}
                  className="rounded"
                />
              )}
            </div>
            <div className="flex flex-row m-2 gap-2">
              {productDetail.carrusel
                ? Object.entries(productDetail.carrusel).map(([key, value]) => (
                    <div
                      className="z-10"
                      key={key}
                      onClick={() => handleImageChange(String(value))}
                    >
                      <Image
                        className={`rounded-md ${
                          value === currentImage
                            ? "border-2 border-blue-500"
                            : ""
                        }`}
                        src={String(value)}
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
          <div className="mb-6 flex flex-col border-b pb-6 border-neutral-700">
            <h1 className="mb-2 text-5xl font-medium">{productDetail.model}</h1>
            <h2>{productDetail.category}</h2>
            <AverageRatingStars productId={productDetail.id} />
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
                    <h1>{String(value)}:</h1>
                  </div>
                ))
              : null}
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col rounded-lg border  p-8 border-neutral-800 bg-black md:p-12  lg:gap-8 ">
          <p>Product Ratings</p>
          <ReviewsList productId={productDetail.id} />
        </div>
        {/* <div className="flex flex-col rounded-lg border p-8 border-neutral-800 bg-black md:p-12  lg:gap-8 ">
          <p>Leave a Feedback</p>
          <ReviewForm productId={productDetail.id}/>
        </div> */}
      </section>
    </main>
  );
}
