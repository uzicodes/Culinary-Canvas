const fs = require('fs');
const files = [
  'd:/Culinary-Canvas/src/app/payment/page.tsx', 
  'd:/Culinary-Canvas/src/app/payment/components/PaymentComponents.tsx', 
  'd:/Culinary-Canvas/src/hooks/usePayment.ts', 
  'd:/Culinary-Canvas/src/hooks/useProfilePictureUpload.ts', 
  'd:/Culinary-Canvas/src/components/ProfilePictureUpload.tsx'
];
files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    if(c.includes('\\`') || c.includes('\\$')) {
      c = c.replace(/\\`/g, '\`');
      c = c.replace(/\\\$/g, '$');
      fs.writeFileSync(f, c);
      console.log('Fixed', f);
    }
  } catch(e) {
    console.error(e);
  }
});
