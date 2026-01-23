import React from "react";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";

import Product from "@/components/Product/Product";
import NoProducts from "@/components/Product/NoProducts";
import BuyProductCard from "@/components/Product/BuyProductCard";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";
// const products = [
//   {
//     title: "Amazon Gift Card",
//     price: "399.00",
//     category: "Amazon product",
//     imageUrl: "/images/gift1.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "Walmart Gift Card",
//     price: "399.00",
//     category: "Walmart product",
//     imageUrl: "/images/gift3.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "ITunes Gift Card",
//     price: "399.00",
//     category: "Apple product",
//     imageUrl: "/images/gift3.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "Flipkart Gift Card",
//     price: "399.00",
//     category: "Flipkart product",
//     imageUrl: "/images/gift1.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "Vanilla Gift Card",
//     price: "399.00",
//     category: "Vanilla product",
//     imageUrl: "/images/gift3.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "Walmart Gift Card",
//     price: "399.00",
//     category: "Walmart product",
//     imageUrl: "/images/gift1.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "ITunes Gift Card",
//     price: "399.00",
//     category: "Apple product",
//     imageUrl: "/images/gift1.png",
//     iconUrl: "/apple.svg",
//   },
//   {
//     title: "Amazon Gift Card",
//     price: "399.00",
//     category: "Amazon product",
//     imageUrl: "/images/gift3.png",
//     iconUrl: "/apple.svg",
//   },
// ];

const fetchProducts = async (accessToken: any, type: string) => {
  const response = await axios.get(
    `${process.env.API_ENDPOINT}/products?category=${type}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  // console.log(response.data.data);

  return response.data.data;
};

const BuyPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access");

  if (accessToken === undefined) {
    return redirect("/login");
  }

  const products = await fetchProducts(accessToken?.value, "Card");

  const filteredProducts = products.filter(
    (product: any) =>
      product.currency.name === searchParams?.currency && product.type === "buy"
  );

  return (
    <div className="w-full flex flex-wrap gap-x-12 gap-y-12 justify-center mx-auto px-4 mt-8 xl:max-w-[1700px]">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product: any) => (
          // <Product key={product.id} productInfo={product} />
          <BuyProductCard key={product.id} productInfo={product} />
        ))
      ) : (
        <NoProducts />
      )}
    </div>
  );
};

export default BuyPage;
