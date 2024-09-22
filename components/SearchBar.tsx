"use client";

import { redirectKey, scrapeAndStoreProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';

const isValidUrl = (url: string) => {
    try {
        const parseURL = new URL(url);
        const hostname = parseURL.hostname;

        if (hostname.includes('amazon.in') ||
            hostname.includes('amzn.in') ||
            hostname.includes('flipkart.com') ||
            hostname.includes('myntra.com')) {
            return true;
        }
    } catch (error) {
        return false;
    }
}

const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValidLink = isValidUrl(searchPrompt);

        if (!isValidLink) return alert('Please provide a valid Link');

        try {
            setIsLoading(true);
            const product = await scrapeAndStoreProduct(searchPrompt);
            const keyy = await redirectKey(searchPrompt);
            console.log(keyy);

            router.push(`/products/${keyy}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
            <input type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder='Enter product link'
                className='searchbar-input'
            />
            <button type='submit' className='searchbar-btn'>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
    )
}

export default SearchBar;
