import json
import re

print('🚀 Starting BULK metadata merge for all products...\n')

# Load enriched data
print('📖 Loading enriched_products.json...')
with open('enriched_products.json', 'r', encoding='utf-8') as f:
    enriched_products = json.load(f)

# Create lookup map
enrich_map = {}
for p in enriched_products:
    if 'id' in p:
        enrich_map[p['id']] = {
            'isbn': p.get('isbn'),
            'authors': p.get('authors'),
            'publisher': p.get('publisher'),
            'publicationDate': p.get('publicationDate'),
            'fullDescription': p.get('fullDescription')
        }

print(f'   ✅ Loaded {len(enrich_map)} enriched product entries\n')

# Read store.ts
print('📖 Reading lib/store.ts...')
with open('lib/store.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'   Total lines: {len(lines)}\n')

# Create backup
print('💾 Creating backup...')
with open('lib/store.ts.backup', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('   ✅ Backup saved to lib/store.ts.backup\n')

# Process line by line
print('🔀 Merging metadata into products...')
new_lines = []
i = 0
current_product_id = None
price_line_found = False
metadata_added = False
products_enriched = 0

while i < len(lines):
    line = lines[i]
    
    # Look for product ID
    id_match = re.search(r'"id":\s*"([^"]+)"', line)
    if id_match:
        current_product_id = id_match.group(1)
        price_line_found = False
        metadata_added = False
    
    # Look for price line (comes before we insert metadata)
    if current_product_id and not metadata_added and '"price":' in line:
        price_line_found = True
        new_lines.append(line)
        
        # Check if we have metadata for this product
        if current_product_id in enrich_map:
            metadata = enrich_map[current_product_id]
            indent = '    '
            
            # Add metadata fields (only if they exist and are not N/A)
            if metadata.get('isbn') and metadata['isbn'] != 'N/A':
                new_lines.append(f'{indent}"isbn": "{metadata["isbn"]}",\n')
            
            if metadata.get('authors') and metadata['authors'] != 'N/A':
                authors = metadata['authors'].replace('\\', '\\\\').replace('"', '\\"')
                new_lines.append(f'{indent}"authors": "{authors}",\n')
            
            if metadata.get('publisher') and metadata['publisher'] != 'N/A':
                publisher = metadata['publisher'].replace('\\', '\\\\').replace('"', '\\"')
                new_lines.append(f'{indent}"publisher": "{publisher}",\n')
            
            if metadata.get('publicationDate') and metadata['publicationDate'] != 'N/A':
                pub_date = metadata['publicationDate'].replace('\\', '\\\\').replace('"', '\\"')
                new_lines.append(f'{indent}"publicationDate": "{pub_date}",\n')
            
            if metadata.get('fullDescription') and metadata['fullDescription'] != 'N/A':
                # Escape the HTML content properly
                desc = metadata['fullDescription'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
                new_lines.append(f'{indent}"fullDescription": "{desc}",\n')
            
            metadata_added = True
            products_enriched += 1
            
            if products_enriched % 50 == 0:
                print(f'   Processed {products_enriched} products...')
        
        i += 1
        continue
    
    # Add the current line
    new_lines.append(line)
    i += 1

print(f'\n✅ Enriched {products_enriched} products!\n')

# Write updated content
print('💾 Writing updated store.ts...')
with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('\n🎉 SUCCESS! Bulk metadata merge complete!\n')
print('📊 Summary:')
print(f'   • Total products enriched: {products_enriched}')
print(f'   • Backup created: lib/store.ts.backup')
print(f'   • Updated file: lib/store.ts')
print('\n✨ Metadata fields added:')
print('   • ISBN')
print('   • Authors')
print('   • Publisher')
print('   • Publication Date')
print('   • Full Description')
print('\n🎯 Next: Visit any product page to see the metadata accordions!')
