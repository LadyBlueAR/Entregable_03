const express = require('express')
const app = express();
const ProductManager = require('./ProductManager');

app.use(express.urlencoded({extended:true}))
const productManager = new ProductManager('./products.json');

app.get('/',  (req, res) => {
  res.json({ saludo: "Bienvenidos a mi Ecommerce"});
})

app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if(limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(200).json({ error: "Error al obtener los productos"});
  }
})

app.get('/products/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.getProductById(productId);

      if(product) res.json(product);
      else res.status(404).json({error: "Producto no Encontrado"});

    } catch (error) {
      res.status(200).json({error: "Error al obtener el producto"});
    }
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
})