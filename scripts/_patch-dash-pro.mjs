import fs from 'fs';
const p = 'c:/Users/ilser/carihub/public/dashboard-rentero.html';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/  <style>[\s\S]*?<\/style>/, '  <link rel="stylesheet" href="css/dashboard-rentero-pro.css">');
fs.writeFileSync(p, c);
console.log('style replaced');
