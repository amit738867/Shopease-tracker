
"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { scrapeProduct } from "../scraper/index";
import { connectToDB } from "../scraper/mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl:string) {
    if(!productUrl) return;

    try {
        connectToDB();
       
        const scrapedProduct = await scrapeProduct(productUrl);
        console.log(scrapedProduct);
        
        if(!scrapedProduct) return;
        let product = scrapedProduct;
        

        const existingProduct = await Product.findOne({url: scrapedProduct.url});

        if(existingProduct){
            const updatedPriceHistory:any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice }
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
                
            }
        }

        
        scrapedProduct.priceHistory.push({ price: scrapedProduct.currentPrice, date: new Date() });
        scrapedProduct.priceHistory.push({ price: scrapedProduct.originalPrice, date: new Date() });


        const newProduct = await Product.findOneAndUpdate({url: scrapedProduct.url}
        ,
            product,
            {upsert: true, new:true }
        
        );

        
        revalidatePath(`/products/${newProduct._id}`);

    } catch (error:any) {
        throw new Error(`Failed to create/update product : ${error.message}`)
    }
}

export async function getProductById(productId: string){
    try {
        connectToDB();

        const product = await Product.findOne({ _id: productId});
        if(!product) return null;

        return product;

    } catch (error) {
        console.log(error);
    }
}

export async function redirectKey(productUrl: string){
    try {

        connectToDB();

        const existingProduct = await Product.findOne({url: productUrl});
       
        const stringId = existingProduct._id;
        let keyy = stringId.toString();

        // console.log(keyy);
        
         if(!keyy) return null;

          return keyy;
        
    } catch (error) {
        console.log(error);
        
    }
}



export async function addUserEmailToProduct(
    productId: string, userEmail: string
){
    try {
        const product = await Product.findById(productId);
        if(!product) return;

        const userExists = product.users.some((user: User) => user.email === userEmail)

        if(!userExists){
            product.users.push({ email: userEmail });
            
            await product.save();

            const emailContent: any = await generateEmailBody(product, 'WELCOME');

            await sendEmail(emailContent, [userEmail]);

        }

    } catch (error) {
        console.log(error)
    }
}


