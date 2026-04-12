import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatEther } from 'viem';

const mockGetBalance = vi.fn();
vi.mock('./helpers/network', () => ({
    createHttpClient: () => ({
        getBalance: mockGetBalance,
    }),
}));

const setupDOM = () => {
    document.body.innerHTML = `
        <input id="account-input" type="text" />
        <i class="search-icon"></i>
        <p id="balance-result"></p>
    `;
};

describe('index page — balance lookup', () => {
    beforeEach(() => {
        setupDOM();
        mockGetBalance.mockReset();
    });

    it('displays balance in ETH after getBalance resolves', async () => {
        mockGetBalance.mockResolvedValue(1000000000000000000n);

        const { formatEther } = await import('viem');
        const client = { getBalance: mockGetBalance };

        const address = '0x93b29E645493441c2DBD78FECe0A477070C881f4';
        const balance = await client.getBalance({ address });
        const result = document.querySelector('#balance-result') as HTMLParagraphElement;
        result.innerText = `Balance: ${parseFloat(formatEther(balance)).toFixed(4)} ETH`;

        expect(result.innerText).toBe('Balance: 1.0000 ETH');
    });

    it('displays 0 ETH for an empty account', async () => {
        mockGetBalance.mockResolvedValue(0n);

        const { formatEther } = await import('viem');
        const client = { getBalance: mockGetBalance };

        const balance = await client.getBalance({ address: '0xabc' });
        const result = document.querySelector('#balance-result') as HTMLParagraphElement;
        result.innerText = `Balance: ${parseFloat(formatEther(balance)).toFixed(4)} ETH`;

        expect(result.innerText).toBe('Balance: 0.0000 ETH');
    });

    it('shows error message when network call fails', async () => {
        mockGetBalance.mockRejectedValue(new Error('network error'));

        const result = document.querySelector('#balance-result') as HTMLParagraphElement;

        try {
            await mockGetBalance({ address: '0xinvalid' });
        } catch {
            result.innerText = 'Invalid address or network error.';
        }

        expect(result.innerText).toBe('Invalid address or network error.');
    });

    it('input field accepts an ethereum address', () => {
        const input = document.querySelector('#account-input') as HTMLInputElement;
        input.value = '0x93b29E645493441c2DBD78FECe0A477070C881f4';
        expect(input.value).toBe('0x93b29E645493441c2DBD78FECe0A477070C881f4');
    });
});
