import { formatEther } from 'viem';
import { createHttpClient } from './helpers/network';

const input = document.querySelector('#account-input') as HTMLInputElement;
const result = document.querySelector('#balance-result') as HTMLParagraphElement;
const searchIcon = document.querySelector('.search-icon') as HTMLElement;

const client = createHttpClient();

const getBalance = async (address: string) => {
    try {
        const balance = await client.getBalance({ address: address as `0x${string}` });
        result.innerText = `Balance: ${parseFloat(formatEther(balance)).toFixed(4)} ETH`;
    } catch {
        result.innerText = 'Invalid address or network error.';
    }
};

input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        getBalance(input.value.trim());
    }
});

searchIcon.addEventListener('click', () => {
    getBalance(input.value.trim());
});
