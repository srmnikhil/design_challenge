const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('vehicleParts.json', 'utf-8'));

// Custom image URL (replace with yours)
const customImageUrl = "https://play-lh.googleusercontent.com/7VGGuCDlNZXbx--5_oQrbVti1N_695h1sZccbe2ZgEudVa3BP2ygo_2Igl2WFjyZig";

// Update each part's image
const updatedData = data.map(part => ({
  ...part,
  image_link: customImageUrl
}));

// Write the updated JSON back to the file
fs.writeFileSync('parts.json', JSON.stringify(updatedData, null, 2));

console.log('Image links updated successfully!');
