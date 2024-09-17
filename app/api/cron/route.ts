import Product from "@/lib/models/product.model";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeProduct } from "@/lib/scraper";
import { connectToDB } from "@/lib/scraper/mongoose"
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration=280;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(){
    try {
        connectToDB();
        
        const products = await Product.find({});
        if(!products) throw new Error('no product found');

        //1. SCRAPE THE LATEST PRODUCT DETAILS AND UPDATE THEM IN DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct)=>{
                const scrapedProduct = await scrapeProduct(currentProduct.url);
                if(!scrapedProduct) throw new Error("No Product Found");

                
                    const updatedPriceHistory = [
                        ...currentProduct.priceHistory,
                        { price: scrapedProduct.currentPrice }
                    ]
        
                   const product = {
                        ...scrapedProduct,
                        priceHistory: updatedPriceHistory,
                        lowestPrice: getLowestPrice(updatedPriceHistory),
                        highestPrice: getHighestPrice(updatedPriceHistory),
                        averagePrice: getAveragePrice(updatedPriceHistory),
                        
                    }
                
        
        
                const updatedProduct = await Product.findOneAndUpdate({url: product.url}
                ,
                    product,
                
                );

                //2. CHECK EACH PRODUCT STATUS AND SEND EMAIL ACCORDINGLY
                const emailnotiftype = getEmailNotifType(scrapedProduct, currentProduct);
                
                if(emailnotiftype && updatedProduct.users.length > 0){
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url,
                    }

                    const emailContent = await generateEmailBody(productInfo, emailnotiftype);

                    const userEmails = updatedProduct.users.map((users: any)=> users.email);

                    await sendEmail(emailContent, userEmails);
                }

                return updatedProduct;
            } )
        )

        return NextResponse.json({
            messege: 'OK', data: updatedProducts
        }
        )

    } catch (error) {
        throw new Error(`Error in GET ${error}`)
    }
}