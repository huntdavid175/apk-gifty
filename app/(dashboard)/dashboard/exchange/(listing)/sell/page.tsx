import { cookies } from "next/headers";
import axios from "axios";
import Product from "@/components/Product/Product";
import { redirect } from "next/navigation";
import NoProducts from "@/components/Product/NoProducts";

// Force dynamic rendering - this page requires authentication
export const dynamic = "force-dynamic";

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

const SellPage = async ({
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
      product.currency.name === searchParams?.currency &&
      product.type === "sell"
  );
  return (
    <div className="w-full flex flex-wrap gap-x-12 gap-y-12 px-4 justify-center mx-auto mt-8 xl:max-w-[1700px]">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product: any) => (
          <Product key={product.imageUrl} productInfo={product} />
        ))
      ) : (
        <NoProducts />
      )}
    </div>
  );
};

export default SellPage;
