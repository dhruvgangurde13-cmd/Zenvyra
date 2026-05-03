const fs = require('fs');
const path = require('path');

const files = [
  "src/app/page.tsx",
  "src/app/products/page.tsx",
  "src/app/products/[id]/page.tsx",
  "src/app/login/page.tsx",
  "src/app/register/page.tsx",
  "src/app/cart/page.tsx",
  "src/app/orders/page.tsx",
  "src/components/AdminGuard.tsx",
  "src/app/admin/page.tsx",
  "src/app/admin/products/page.tsx",
  "src/app/admin/orders/page.tsx"
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace exact strings "http://127.0.0.1:8000/api/..." -> `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/...`
    content = content.replace(/"http:\/\/127\.0\.0\.1:8000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}$1`');
    
    // Replace template literals `http://127.0.0.1:8000/api/...` -> `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/...`
    content = content.replace(/`http:\/\/127\.0\.0\.1:8000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}$1`');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated", file);
  } else {
    console.log("Not found:", file);
  }
});
