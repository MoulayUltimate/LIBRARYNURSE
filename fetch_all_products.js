const fs = require('fs');
const https = require('https');

const baseUrl = 'https://medicalreaders.com/products.json';
const limit = 250;
let page = 1;
let allProducts = [];

function fetchPage(pageNumber) {
    return new Promise((resolve, reject) => {
        const url = `${baseUrl}?limit=${limit}&page=${pageNumber}`;
        console.log(`Fetching page ${pageNumber}...`);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    // Check if response is HTML (starts with <)
                    if (data.trim().startsWith('<')) {
                        console.error('Received HTML instead of JSON. Preview:', data.substring(0, 100));
                        reject(new Error('Received HTML response'));
                        return;
                    }

                    const jsonData = JSON.parse(data);
                    resolve(jsonData.products || []);
                } catch (e) {
                    console.error('JSON Parse Error:', e.message);
                    reject(e);
                }
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function fetchAll() {
    try {
        while (true) {
            const products = await fetchPage(page);
            if (products.length === 0) {
                console.log('No more products found.');
                break;
            }

            allProducts = allProducts.concat(products);
            console.log(`Retrieved ${products.length} products. Total so far: ${allProducts.length}`);
            page++;

            // Add a small delay to be polite
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        fs.writeFileSync('all_products.json', JSON.stringify({ products: allProducts }, null, 2));
        console.log(`Successfully saved ${allProducts.length} products to all_products.json`);

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

fetchAll();
