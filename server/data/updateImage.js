const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('vehicleParts.json', 'utf-8'));

// Remove unwanted fields from each part
const updatedData = data.map(({ manufacturer_name, image_link, quantity_in_inventory, ...rest }) => rest);

// Write the updated JSON back to the file
fs.writeFileSync('parts.json', JSON.stringify(updatedData, null, 2));

console.log('Unwanted fields removed successfully!');
