// import Modal from "@/components/Modal";

import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";

import { getProductById } from "@/lib/actions"
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string }
}

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if(!product) redirect('/')

  

  return (
    <div className="product-container">
      <div className="flex gap-10 xl:flex-row flex-col">
        <div className="product-image">
          <Image 
            src={product.imgURL}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
            unoptimized
          />
        </div>

        <div className="flex-1 flex flex-col">
            <div className="flex flex-col gap-3 border-b pb-4">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>

            </div>
          <div className="flex justify-between items-start gap-5 flex-wrap pb-3 pt-3">
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50 pt-1"
              >
                Visit Product
              </Link>
              <div className="p-2 flex bg-white-200 rounded-10">
              
              <Image 
                src="/assets/icons/share.svg"
                alt="share"
                width={20}
                height={20}
                />
                
              </div>

            
          </div>

          <div className="product-info">
            <div className="flex flex-col gap-2">
            <div className="flex ">
              <p className="text-[34px] text-secondary font-bold">
              ₹ {formatNumber(product.currentPrice)}
              </p>
              <p className="px-2 text-red-500 text-xl font-bold">
                -{product.discount}%
              </p>
            </div>
              <p className="text-[21px] text-black opacity-50 line-through">
              ₹ {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div>
                  <button className="btn w-fit mx-auto flex items-center justify-center gap-3 xl:min-w-[200px] min-w-[150px]">
                    <Image 
                      src="/assets/icons/bag.svg"
                      alt="check"
                      width={22}
                      height={22}
                    />

                    <Link href={product.url} className="text-base text-white">
                      Buy Now
                    </Link>
                  </button>
                
            </div>
            
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard 
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`₹ ${formatNumber(product.currentPrice)}`}
              />
              <PriceInfoCard 
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`₹ ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard 
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`₹ ${formatNumber(product.highestPrice)}`}
              />
              <PriceInfoCard 
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`₹ ${formatNumber(product.lowestPrice)}`}
              />
            </div>
          </div>

          <Modal productId={id} />
                {/* <div className="flex flex-col gap-16">
                  <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
                    <Image 
                      src="/assets/icons/bag.svg"
                      alt="check"
                      width={22}
                      height={22}
                    />

                    <Link href="/" className="text-base text-white">
                      Buy Now
                    </Link>
                  </button>
                </div> */}
        </div>
      </div>
  
    

    </div>
  )
}

export default ProductDetails
