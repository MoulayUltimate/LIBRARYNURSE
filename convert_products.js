const fs = require('fs');

const productsData = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const products = productsData.products;

const csvHeader = 'id,title,author,category,collection,price,description,image,pages,format\n';

function escapeCsv(text) {
    if (!text) return '';
    // Remove HTML tags
    let cleanText = text.replace(/<[^>]*>?/gm, ' ');
    // Replace multiple spaces with single space
    cleanText = cleanText.replace(/\s\s+/g, ' ').trim();
    // Escape quotes
    cleanText = cleanText.replace(/"/g, '""');
    return `"${cleanText}"`;
}

function getCategory(product) {
    if (product.product_type) return product.product_type;
    const title = product.title.toLowerCase();
    if (title.includes('veterinary') || title.includes('animal') || title.includes('dog') || title.includes('cat')) return 'Veterinary';
    if (title.includes('nursing')) return 'Nursing';
    if (title.includes('medicine') || title.includes('clinical')) return 'Medicine';
    return 'Medical Books';
}

function getCollection(category) {
    const slug = category.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    return slug;
}

const csvRows = products.map(product => {
    const id = product.id;
    const title = escapeCsv(product.title);
    const author = escapeCsv(product.vendor || 'Medical Readers');
    const categoryRaw = getCategory(product);
    const category = escapeCsv(categoryRaw);
    const collection = escapeCsv(getCollection(categoryRaw));
    const price = product.variants[0] ? product.variants[0].price : '0.00';
    const description = escapeCsv(product.body_html);
    const image = product.images[0] ? product.images[0].src : '';
    const pages = Math.floor(Math.random() * (800 - 200 + 1) + 200); // Random pages for now
    const format = 'PDF';

    return `${id},${title},${author},${category},${collection},${price},${description},${image},${pages},${format}`;
});

const csvContent = csvHeader + csvRows.join('\n');

fs.writeFileSync('products.csv', csvContent);
console.log(`Converted ${products.length} products to products.csv`);
