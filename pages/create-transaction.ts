import { WalletClient, Hash, parseEther, isAddress, formatEther } from 'viem';
import { createWallet, createHttpClient } from '../helpers/network';

const form = document.querySelector('#transaction-form') as HTMLFormElement;
const fromInput = document.querySelector('#from') as HTMLInputElement;
const toInput = document.querySelector('#to') as HTMLInputElement;
const valueInput = document.querySelector('#value') as HTMLInputElement;

const fromError = document.querySelector('#from-error') as HTMLSpanElement;
const toError = document.querySelector('#to-error') as HTMLSpanElement;
const valueError = document.querySelector('#value-error') as HTMLSpanElement;

let client: WalletClient;

const initApp = () => {
    client = createWallet();
};

const setError = (input: HTMLInputElement, span: HTMLSpanElement, message: string) => {
    input.classList.add('input-error');
    span.innerText = message;
};

const clearError = (input: HTMLInputElement, span: HTMLSpanElement) => {
    input.classList.remove('input-error');
    span.innerText = '';
};

const validate = async (): Promise<boolean> => {
    let valid = true;

    // Validate from
    if (!fromInput.value.trim()) {
        setError(fromInput, fromError, 'Sender address is required.');
        valid = false;
    } else if (!isAddress(fromInput.value.trim())) {
        setError(fromInput, fromError, 'Invalid Ethereum address.');
        valid = false;
    } else {
        clearError(fromInput, fromError);
    }

    // Validate to
    if (!toInput.value.trim()) {
        setError(toInput, toError, 'Recipient address is required.');
        valid = false;
    } else if (!isAddress(toInput.value.trim())) {
        setError(toInput, toError, 'Invalid Ethereum address.');
        valid = false;
    } else {
        clearError(toInput, toError);
    }

    // Validate value
    if (!valueInput.value.trim()) {
        setError(valueInput, valueError, 'Value is required.');
        valid = false;
    } else if (isNaN(parseFloat(valueInput.value)) || parseFloat(valueInput.value) <= 0) {
        setError(valueInput, valueError, 'Enter a valid amount greater than 0.');
        valid = false;
    } else if (valid && isAddress(fromInput.value.trim())) {
        // Check balance only if address is valid
        try {
            const publicClient = createHttpClient();
            const balance = await publicClient.getBalance({ address: fromInput.value.trim() as Hash });
            const sendAmount = parseEther(valueInput.value);
            if (sendAmount > balance) {
                setError(valueInput, valueError, `Exceeds balance (${parseFloat(formatEther(balance)).toFixed(4)} ETH).`);
                valid = false;
            } else {
                clearError(valueInput, valueError);
            }
        } catch {
            clearError(valueInput, valueError);
        }
    } else {
        clearError(valueInput, valueError);
    }

    return valid;
};

const createTransaction = async (e: SubmitEvent) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    try {
        await client.sendTransaction({
            account: fromInput.value as Hash,
            to: toInput.value as Hash,
            value: parseEther(valueInput.value),
            chain: undefined
        });
        location.href = './blocks.html';
    } catch (error) {
        console.error(error);
    }
};

initApp();

fromInput.addEventListener('input', () => clearError(fromInput, fromError));
fromInput.addEventListener('focus', () => clearError(fromInput, fromError));
toInput.addEventListener('input', () => clearError(toInput, toError));
toInput.addEventListener('focus', () => clearError(toInput, toError));
valueInput.addEventListener('input', () => clearError(valueInput, valueError));
valueInput.addEventListener('focus', () => clearError(valueInput, valueError));

form.addEventListener('submit', createTransaction);
