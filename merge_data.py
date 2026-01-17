import json
import re

print('🔄 Starting data merge process...\n')

# Read enriched products
print('📖 Reading enriched_products.json...')
with open('enriched_products.json', 'r', encoding='utf-8') as f:
    enriched_products = json.load(f)
print(f'   Found {len(enriched_products)} enriched products\n')

# Read store.ts
print('📖 Reading lib/store.ts...')
with open('lib/store.ts', 'r', encoding='utf-8') as f:
    store_content = f.read()

# Create enrichment map
print('🗺️  Creating enrichment map...')
enrichment_map = {}
for product in enriched_products:
    pid = product.get('id')
    if pid:
        enrichment_map[pid] = {
            'isbn': product.get('isbn'),
            'authors': product.get('authors'),
            'publisher': product.get('publisher'),
            'publicationDate': product.get('publicationDate'),
            'fullDescription': product.get('fullDescription')
        }
print(f'   Created map with {len(enrichment_map)} enriched entries\n')

# Parse products from store.ts
print('🔍 Parsing existing products from store.ts...')
match = re.search(r'export const products: Product\[\] = (\[[\s\S]*?\n\]);', store_content)
if not match:
    print('❌ Could not find products array')
    exit(1)

products_json = match.group(1)
# Fix TypeScript to JSON
products_json = re.sub(r'([{,]\s*)(\w+):', r'\1"\2":', products_json)  # Quote keys
existing_products = json.loads(products_json)
print(f'   Found {len(existing_products)} existing products\n')

# Merge
print('🔀 Merging enriched data...')
enriched_count = 0
for product in existing_products:
    pid = product.get('id')
    if pid and pid in enrichment_map:
        enrichment = enrichment_map[pid]
        for key, value in enrichment.items():
            if value and value != 'N/A':
                product[key] = value
                if key == 'isbn':
                    enriched_count += 1
print(f'   ✅ Enriched {enriched_count} products\n')

# Convert back to TypeScript format
print('📝 Formatting updated products...')
products_ts = json.dumps(existing_products, indent=2, ensure_ascii=False)
products_ts = re.sub(r'"(\w+)":', r'\1:', products_ts)  # Unquote keys

# Replace in store.ts
print('💾 Updating lib/store.ts...')
new_store_content = re.sub(
    r'export const products: Product\[\] = \[[\s\S]*?\n\];',
    f'export const products: Product[] = {products_ts};',
    store_content
)

# Backup
print('📦 Creating backup at lib/store.ts.backup...')
with open('lib/store.ts.backup', 'w', encoding='utf-8') as f:
    f.write(store_content)

# Write
with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(new_store_content)

print('\n✅ SUCCESS! Data merge complete!\n')
print('📊 Summary:')
print(f'   • Total products: {len(existing_products)}')
print(f'   • Enriched products: {enriched_count}')
print(f'   • Backup created: lib/store.ts.backup')
print(f'   • Updated file: lib/store.ts\n')
