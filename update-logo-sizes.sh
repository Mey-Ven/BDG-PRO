#!/bin/bash
# Update all logo sizes from h-8 to h-12
sed -i '' 's/className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"/className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"/g' app/page.tsx

# Update spacing between logos to accommodate larger size
sed -i '' 's/gap-12 md:gap-16 lg:gap-20/gap-8 md:gap-12 lg:gap-16/g' app/page.tsx
