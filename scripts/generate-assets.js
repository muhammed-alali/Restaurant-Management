const fs = require('fs');
const path = require('path');

const foodDir = path.join(__dirname, '..', 'public', 'images', 'food');
const tableDir = path.join(__dirname, '..', 'public', 'images', 'tables');
const placeholderDir = path.join(__dirname, '..', 'public', 'images', 'placeholders');

[foodDir, tableDir, placeholderDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const items = {
  burger_classic: `
  <rect width="400" height="300" rx="16" fill="#FFF7ED"/>
  <path d="M 100 130 C 100 60, 300 60, 300 130 Z" fill="#E28743"/>
  <circle cx="150" cy="90" r="3" fill="#FEF3C7"/>
  <circle cx="180" cy="80" r="3" fill="#FEF3C7"/>
  <circle cx="210" cy="80" r="3" fill="#FEF3C7"/>
  <circle cx="240" cy="90" r="3" fill="#FEF3C7"/>
  <path d="M 85 130 Q 120 145, 150 130 T 215 135 T 280 130 T 315 135 L 310 145 Q 260 155, 200 145 T 90 145 Z" fill="#22C55E"/>
  <rect x="105" y="145" width="190" height="14" rx="7" fill="#EF4444"/>
  <polygon points="95,159 305,159 285,180 200,168 120,182" fill="#FBBF24"/>
  <rect x="95" y="165" width="210" height="30" rx="15" fill="#78350F"/>
  <path d="M 105 195 L 295 195 C 295 230, 105 230, 105 195 Z" fill="#E28743"/>
`,
  burger_cheese: `
  <rect width="400" height="300" rx="16" fill="#FFF7ED"/>
  <path d="M 100 130 C 100 60, 300 60, 300 130 Z" fill="#E28743"/>
  <circle cx="150" cy="90" r="3" fill="#FEF3C7"/>
  <circle cx="200" cy="80" r="3" fill="#FEF3C7"/>
  <circle cx="250" cy="90" r="3" fill="#FEF3C7"/>
  <rect x="95" y="132" width="210" height="25" rx="12" fill="#78350F"/>
  <polygon points="90,157 310,157 270,185 200,170 120,185" fill="#F59E0B"/>
  <rect x="95" y="165" width="210" height="25" rx="12" fill="#78350F"/>
  <path d="M 105 190 L 295 190 C 295 225, 105 225, 105 190 Z" fill="#E28743"/>
`,
  pizza_margherita: `
  <rect width="400" height="300" rx="16" fill="#FFFBEB"/>
  <circle cx="200" cy="150" r="110" fill="#D97706"/>
  <circle cx="200" cy="150" r="95" fill="#DC2626"/>
  <circle cx="200" cy="150" r="85" fill="#FBBF24"/>
  <circle cx="160" cy="120" r="14" fill="#EF4444"/>
  <circle cx="230" cy="130" r="14" fill="#EF4444"/>
  <circle cx="180" cy="180" r="14" fill="#EF4444"/>
  <circle cx="220" cy="185" r="14" fill="#EF4444"/>
  <path d="M 175 140 Q 185 130, 195 140 Q 185 150, 175 140 Z" fill="#16A34A"/>
  <path d="M 215 155 Q 225 145, 235 155 Q 225 165, 215 155 Z" fill="#16A34A"/>
  <path d="M 150 160 Q 160 150, 170 160 Q 160 170, 150 160 Z" fill="#16A34A"/>
`,
  pizza_veggie: `
  <rect width="400" height="300" rx="16" fill="#FFFBEB"/>
  <circle cx="200" cy="150" r="110" fill="#D97706"/>
  <circle cx="200" cy="150" r="95" fill="#DC2626"/>
  <circle cx="200" cy="150" r="85" fill="#FDE68A"/>
  <circle cx="160" cy="130" r="12" fill="#16A34A"/>
  <circle cx="220" cy="125" r="12" fill="#16A34A"/>
  <circle cx="170" cy="175" r="12" fill="#16A34A"/>
  <circle cx="230" cy="170" r="12" fill="#16A34A"/>
  <circle cx="200" cy="150" r="8" fill="#172033"/>
  <circle cx="180" cy="135" r="7" fill="#172033"/>
  <circle cx="215" cy="180" r="7" fill="#172033"/>
  <rect x="185" y="160" width="16" height="8" rx="3" fill="#DC2626"/>
  <rect x="155" y="145" width="16" height="8" rx="3" fill="#DC2626"/>
`,
  shawarma_chicken: `
  <rect width="400" height="300" rx="16" fill="#FEFCE8"/>
  <ellipse cx="200" cy="150" rx="110" ry="40" fill="#FDE68A" transform="rotate(-15 200 150)"/>
  <ellipse cx="200" cy="150" rx="100" ry="32" fill="#F59E0B" transform="rotate(-15 200 150)"/>
  <circle cx="170" cy="140" r="10" fill="#22C55E"/>
  <circle cx="210" cy="145" r="12" fill="#EF4444"/>
  <circle cx="240" cy="150" r="10" fill="#F8FAFC"/>
  <path d="M 130 145 L 270 135" stroke="#B45309" stroke-width="4" stroke-dasharray="8 8"/>
`,
  grilled_chicken: `
  <rect width="400" height="300" rx="16" fill="#FFF7ED"/>
  <ellipse cx="190" cy="155" rx="75" ry="50" fill="#C2410C"/>
  <ellipse cx="250" cy="125" rx="20" ry="35" fill="#EA580C" transform="rotate(25 250 125)"/>
  <line x1="140" y1="135" x2="230" y2="135" stroke="#78350F" stroke-width="4"/>
  <line x1="145" y1="155" x2="235" y2="155" stroke="#78350F" stroke-width="4"/>
  <line x1="150" y1="175" x2="225" y2="175" stroke="#78350F" stroke-width="4"/>
  <circle cx="130" cy="190" r="15" fill="#22C55E"/>
  <circle cx="155" cy="195" r="12" fill="#EF4444"/>
`,
  chicken_wings: `
  <rect width="400" height="300" rx="16" fill="#FFF7ED"/>
  <ellipse cx="160" cy="140" rx="45" ry="25" fill="#EA580C" transform="rotate(-25 160 140)"/>
  <ellipse cx="230" cy="140" rx="45" ry="25" fill="#C2410C" transform="rotate(25 230 140)"/>
  <ellipse cx="195" cy="175" rx="45" ry="25" fill="#9A3412"/>
  <circle cx="140" cy="175" r="12" fill="#F8FAFC"/>
  <circle cx="250" cy="175" r="12" fill="#EF4444"/>
`,
  green_salad: `
  <rect width="400" height="300" rx="16" fill="#F0FDF4"/>
  <ellipse cx="200" cy="165" rx="95" ry="50" fill="#E2E8F0"/>
  <ellipse cx="200" cy="155" rx="85" ry="42" fill="#FFFFFF"/>
  <circle cx="165" cy="145" r="22" fill="#22C55E"/>
  <circle cx="210" cy="135" r="26" fill="#16A34A"/>
  <circle cx="235" cy="150" r="20" fill="#4ADE80"/>
  <circle cx="180" cy="160" r="10" fill="#EF4444"/>
  <circle cx="215" cy="165" r="10" fill="#EF4444"/>
  <circle cx="150" cy="155" r="8" fill="#F59E0B"/>
  <circle cx="240" cy="135" r="8" fill="#172033"/>
`,
  caesar_salad: `
  <rect width="400" height="300" rx="16" fill="#F0FDF4"/>
  <ellipse cx="200" cy="165" rx="95" ry="50" fill="#E2E8F0"/>
  <ellipse cx="200" cy="155" rx="85" ry="42" fill="#FFFFFF"/>
  <circle cx="170" cy="140" r="24" fill="#22C55E"/>
  <circle cx="225" cy="140" r="24" fill="#16A34A"/>
  <rect x="180" y="145" width="14" height="14" rx="2" fill="#FDE68A"/>
  <rect x="210" y="155" width="14" height="14" rx="2" fill="#FDE68A"/>
  <rect x="155" y="155" width="14" height="14" rx="2" fill="#FDE68A"/>
  <path d="M 150 135 Q 200 170, 250 135" stroke="#FFFFFF" stroke-width="4" fill="none"/>
`,
  orange_juice: `
  <rect width="400" height="300" rx="16" fill="#EFF6FF"/>
  <polygon points="160,80 240,80 225,230 175,230" fill="#F97316"/>
  <polygon points="160,80 240,80 245,75 155,75" fill="#E2E8F0"/>
  <polygon points="175,230 225,230 228,235 172,235" fill="#CBD5E1"/>
  <rect x="195" y="40" width="8" height="100" fill="#EF4444" transform="rotate(15 195 40)"/>
  <circle cx="245" cy="100" r="28" fill="#FBBF24"/>
  <circle cx="245" cy="100" r="24" fill="#F97316"/>
`,
  cola: `
  <rect width="400" height="300" rx="16" fill="#F1F5F9"/>
  <rect x="165" y="80" width="70" height="150" rx="12" fill="#DC2626"/>
  <rect x="165" y="130" width="70" height="40" fill="#FFFFFF"/>
  <ellipse cx="200" cy="150" rx="25" ry="12" fill="#DC2626"/>
  <rect x="175" y="72" width="50" height="10" rx="4" fill="#94A3B8"/>
`,
  french_fries: `
  <rect width="400" height="300" rx="16" fill="#FEFCE8"/>
  <rect x="165" y="90" width="10" height="70" fill="#FBBF24" transform="rotate(-15 165 90)"/>
  <rect x="180" y="75" width="10" height="85" fill="#FBBF24" transform="rotate(-5 180 75)"/>
  <rect x="195" y="70" width="10" height="90" fill="#FBBF24"/>
  <rect x="210" y="75" width="10" height="85" fill="#FBBF24" transform="rotate(5 210 75)"/>
  <rect x="225" y="90" width="10" height="70" fill="#FBBF24" transform="rotate(15 225 90)"/>
  <polygon points="150,150 250,150 235,230 165,230" fill="#DC2626"/>
  <ellipse cx="200" cy="190" rx="15" ry="15" fill="#FBBF24"/>
`,
  pasta_alfredo: `
  <rect width="400" height="300" rx="16" fill="#F8FAFC"/>
  <ellipse cx="200" cy="165" rx="95" ry="50" fill="#E2E8F0"/>
  <ellipse cx="200" cy="155" rx="85" ry="42" fill="#FFFFFF"/>
  <path d="M 150 145 Q 180 125, 210 145 T 250 145" stroke="#FDE68A" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M 145 160 Q 185 140, 225 160 T 255 160" stroke="#FEF3C7" stroke-width="12" fill="none" stroke-linecap="round"/>
  <circle cx="170" cy="140" r="6" fill="#78350F"/>
  <circle cx="215" cy="150" r="7" fill="#78350F"/>
  <circle cx="190" cy="165" r="5" fill="#22C55E"/>
  <circle cx="230" cy="145" r="4" fill="#22C55E"/>
`
};

for (const [name, content] of Object.entries(items)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">${content}</svg>`;
  fs.writeFileSync(path.join(foodDir, `${name}.svg`), svg);
  fs.writeFileSync(path.join(foodDir, `${name}.png`), svg); // SVGs also saved as .png fallback
  fs.writeFileSync(path.join(placeholderDir, `${name}.svg`), svg);
}

// Table SVG
const tableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
  <rect width="120" height="120" rx="12" fill="none"/>
  <!-- Table top -->
  <rect x="25" y="35" width="70" height="50" rx="8" fill="#3B82F6" opacity="0.15" stroke="#2563EB" stroke-width="2"/>
  <!-- Chairs -->
  <rect x="45" y="18" width="30" height="10" rx="4" fill="#94A3B8"/>
  <rect x="45" y="92" width="30" height="10" rx="4" fill="#94A3B8"/>
  <rect x="8" y="45" width="10" height="30" rx="4" fill="#94A3B8"/>
  <rect x="102" y="45" width="10" height="30" rx="4" fill="#94A3B8"/>
</svg>`;

fs.writeFileSync(path.join(tableDir, 'table.svg'), tableSvg);
fs.writeFileSync(path.join(tableDir, 'table.png'), tableSvg);

console.log('Food and table assets generated successfully!');
