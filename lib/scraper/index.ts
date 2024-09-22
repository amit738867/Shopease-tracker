"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';




export async function scrapeProduct(url: string) {
    if (!url) return;

    const isValidUrl = (url: string) => {
        try {
            const parseURL = new URL(url);
            const hostname = parseURL.hostname;

            if (hostname.includes('amazon.in') || hostname.includes('amzn.in')) {
                return "amazon";
            } else if (hostname.includes('flipkart.com')) {
                return "flipkart";
            } else if (hostname.includes('myntra.com')) {
                return "myntra";
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    const platform = isValidUrl(url);
    if (!platform) return;

    if (platform === "amazon") {
        try {
            console.log('on it.................');
    
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
    
            const fetchedName = $('#productTitle').text().trim();
            const fetchedPrice = $('.a-price-whole').first().text();
            const re2 = fetchedPrice.match(/[\d]+/g)?.join('') || '';
            
            const fetchedImg = $('#imgTagWrapperId img').attr('src');
            
            const fetchedDiscount = $('.a-size-large.a-color-price.savingPriceOverride.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage').text();
            const re8 = parseFloat(fetchedDiscount.replace('%', '').replace('-', ''));
            const fetchedPriceOrigin = $('.a-size-small.aok-offscreen').first().text();
            const re = fetchedPriceOrigin.match(/[\d]+/g)?.join('') || '';
            const result = re.slice(0, -2);
    
            const parser = {
                title: fetchedName,
                currentPrice: Number(re2),
                originalPrice: Number(result),
                discount: Number(re8),
                imgURL: fetchedImg,
                priceHistory: [{ price: Number(re2) , date: new Date() }, { price: Number(result) , date: new Date()}],
                lowestPrice: Number(re2) || Number(result),
                highestPrice: Number(result) || Number(re2),
                averagePrice: Number(re2) || Number(result),
            };
    
            const data = {url, ...parser};
            return data;
    
        } catch (error: any) {
            throw new Error(`Failed to scrape Product: ${error}`);
        }

    } else if (platform === "flipkart") {
        try {
            console.log("scraping flipkart......")

            const apiKey = process.env.PHANTOMJSCLOUD_API_KEY; // Make sure to set this in your environment variables
           
            const apiEndpoint = `https://phantomjscloud.com/api/browser/v2/${apiKey}/`

            const requestData = {
                url: url,
                renderType: 'html',
                outputAsJson: true
            }

            const response = await axios.post(apiEndpoint, requestData);
            const responseData = response.data.content.data;

                    const $ = cheerio.load(responseData);


                const fetchedName = $('.VU-ZEz').text().trim();
                const fetchedPrice = $('.Nx9bqj.CxhGGd').first().text();
                const re2 = parseInt(fetchedPrice.replace(/[^0-9]/g, ''), 10) || '';
                
                const img1= $('.DByuf4.IZexXJ.jLEJ7H').attr('src');
                const img2= $('._53J4C-.utBuJY').attr('src');
                const fetchedImg = img1 || img2;
                
                const fetchedDiscount = $('.UkUFwK.WW8yVX span').text();
                const re8 = parseInt(fetchedDiscount, 10);
                const fetchedPriceOrigin = $('.yRaY8j.A6\\+E6v').first().text();
                const result = parseInt(fetchedPriceOrigin.replace(/[^0-9]/g, ''), 10) || '';
                
        
                const parser = {
                    title: fetchedName,
                    currentPrice: Number(re2),
                    originalPrice: Number(result),
                    discount: Number(re8),
                    imgURL: fetchedImg,
                    priceHistory: [{ price: Number(re2) , date: new Date() }, { price: Number(result) , date: new Date()}],
                    lowestPrice: Number(re2) || Number(result),
                    highestPrice: Number(result) || Number(re2),
                    averagePrice: Number(re2) || Number(result),
                };
                
                const data = {url, ...parser};

                return data;

        } catch (error: any) {
            throw new Error(`Failed to scrape Product: ${error.message}`);
        }

    } else if (platform === "myntra") {
        // Add implementation for Myntra if needed
    }
}
