import { PublicClient, formatEther } from 'viem';
import { createHttpClient } from '../helpers/network';
import { createElement, createTextElement } from '../helpers/dom';

const blockList = document.querySelector("#list") as HTMLDivElement;
const balanceHeader = document.querySelector("#balance") as HTMLHeadingElement;
const totalBlocksHeader = document.querySelector("#total-blocks") as HTMLHeadingElement;

let client: PublicClient;

const initApp = () => {
    // #1. Skapa vår http client...
    client = createHttpClient();
    // #2. Hämta saldot för valt konto
    getBalance('0x93b29E645493441c2DBD78FECe0A477070C881f4');
    // #3. Lista alla block för kontot
    listBlocks();
};

const getBalance = async (address: any) => {
    const balance = await client.getBalance({ address: address });
    balanceHeader.innerText = `Current balance ${parseFloat(formatEther(balance)).toFixed(2)} ETH`;
};

const listBlocks = async () => {
    const blocks = await client.getBlockNumber();
    totalBlocksHeader.innerText = `Total blocks: ${blocks.toString()}`;

    for (let i = blocks; i >= blocks - 10n; i--) {
        const block = await client.getBlock({ blockNumber: i });

        const div = createElement("div");
        div.classList.add("section");
        div.appendChild(createTextElement("div", block.number.toString()));
        div.appendChild(createTextElement("div", block.hash));
        div.appendChild(createTextElement("div", new Date(parseInt(((block.timestamp * 1000n) as unknown) as string)).toLocaleString()));

        // Skapa en knapp för att navigera till transaktioner...
        const button = createElement('a');
        button.innerText = 'Show';
        button.classList.add('btn');
        button.classList.add('btn-rounded');
        button.style.width = '100px';
        (button as HTMLAnchorElement).href = `./transaction.html?hash=${block.hash}`;
        div.appendChild(button);

        blockList.appendChild(div);
    }
};

initApp();