const connectToDatabase = require('./db');
const express = require('express');
const cors = require('cors');
const { productRoutes, supplierRoutes, inventoryRoutes } = require('./routes');
connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.get('/', (req, res) => {
    res.send('Hello from backend');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})