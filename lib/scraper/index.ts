"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeProduct(url: string) {
    if (!url) return;

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
        const fetchedPriceOrigin = $('.a-size-small.aok-offscreen').text();
        const re = fetchedPriceOrigin.match(/[\d]+/g)?.join('') || '';
        const result = re.slice(0, -2);

        const parser = {
            title: fetchedName,
            currentPrice: Number(re2),
            originalPrice: Number(result),
            discount: Number(re8),
            imgURL: fetchedImg,
            priceHistory: [Number(re2), Number(result)],
            lowestPrice: Number(re2) || Number(result),
            highestPrice: Number(result) || Number(re2),
            averagePrice: Number(re2) || Number(result),
        };

        const data = {url, ...parser};
        return data;

    } catch (error: any) {
        throw new Error(`Failed to scrape Product: ${error.message}`);
    }
}