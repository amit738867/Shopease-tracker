"use server"

import puppeteer, { Browser } from 'puppeteer';

import axios from 'axios';
import * as cheerio from 'cheerio';


export async function scrapeProduct(url:string) {
    if(!url) return;

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_806a9f34-zone-pricewise:xryet9g0tasx -k "https://geo.brdtest.com/welcome.txt"
    
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random())  | 0;
    const options = {
        auth:{
            username:  `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        //fetch the product
        const response = await axios.get(url, options);
        console.log(response.data);

        
    } catch (error: any) {
        throw new Error(`Failed to scrape Product : ${error.message}`);
    }
       
}