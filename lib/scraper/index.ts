"use server";

import puppeteer, { Browser } from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { title } from 'process';

let browser: Browser | null = null;

async function getBrowserInstance() {
    if (!browser) {
        browser = await puppeteer.launch({
            executablePath: '/google/idx/builtins/bin/chromium-browser',
            headless: 'shell',
        args: ['--enable-gpu'], });
    }
    return browser;
}

export async function scrapeProduct(url: string) {
    if (!url) return;

    try {
        console.log('on it.................');

        const browser = await getBrowserInstance();
        const page = await browser.newPage();

        // Block unnecessary resources
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if ( resourceType === 'stylesheet' || resourceType === 'font') {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Reduce navigation timeout
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        const parser = await page.evaluate(() => {
            const fetchedPrice = document.querySelector('.a-price-whole');
            const fpp: any = fetchedPrice?.textContent;
            const re2 = fpp.match(/[\d]+/g).join('');
            
            const fetchedName = document.querySelector('#productTitle');
            const fetchedImg = document.querySelectorAll('#imgTagWrapperId');
            const re3 = fetchedImg[0]?.querySelector('img');
            const final = re3?.getAttribute('src')
            
            
            const fetchedDiscount = document.querySelector('.a-size-large.a-color-price.savingPriceOverride.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage');
            

            const fetchedPriceOrigin = document.querySelector('.a-size-small.aok-offscreen');
            const ftt: any = fetchedPriceOrigin?.textContent;
            const re = ftt.match(/[\d]+/g).join('');
            const result = re.slice(0, -2);
            


            const fetched = {
                title: fetchedName?.textContent?.trim(),
                currentPrice: re2,
                originalPrice: result,
                discount: fetchedDiscount?.textContent,
                imgURL: final,
                priceHistory: [],
                lowestPrice: re2 || result,
                highestPrice: result || re2,
                averagePrice: re2 || result,
            };

            return fetched;
        });

        const data = {url,...parser};
        return data;
        
        

        await page.close();

    } catch (error: any) {
        throw new Error(`Failed to scrape Product: ${error.message}`);
    }
}
