const fs = require('fs');

class ProductManager {

    #path

    constructor(path) {
        this.#path = path;
        this.products = [];
        this.idProduct = 1;
    }

    addProduct(title,description,price,thumbnail,code,stock) {
    // Valida que todos los campos sean obligatorios
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log('Error: Todos los campos son obligatorios.');
        return;
      }  
      // Valida que no se repita el campo "code"
      if (this.products.some(product => product.code === code)) {
        console.log('Error: El código del producto ya existe.');
        return;
      }

      const product = {
        id: this.idProduct++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      }

      this.products.push(product);
      console.log("Producto", product.id, "Agregado")
      this.saveProducts();
    }

    getProducts() {
      try {
        const data = fs.readFileSync(this.#path, 'utf-8');
        const products = JSON.parse(data);
        this.products = products;
        return products;
      } catch (error) {
        console.log("Error al leer el archivo de productos", error);
        return [];
      }
    }
    getProductById(id) {
      const productos = this.getProducts();
      const productoEncontrado = productos.find(p => String(p.id) === id);
      if (productoEncontrado) {
        return productoEncontrado;
      } else {
        console.log("Producto no encontrado en el archivo.");
      }
    }

    updateProduct(id, camposActualizar) {
      const productos = this.getProducts();
      const index = productos.findIndex((p) => p.id === id);

      if(index !== -1) {
        const updateProduct = {...productos[index], ...camposActualizar};
        productos[index] = updateProduct;
        this.saveProducts(productos);
        return updateProduct;
      }
    }

    deleteProduct(id){
      const productos = this.getProducts();
      const index = productos.findIndex((p) => p.id === id);

      if(index !== -1) {
        const deletedProduct = productos.splice(index,1)[0];
        this.saveProducts(productos);
        console.log("Producto", id, "Eliminado");
        return deletedProduct;
      } else {
        console.log("No existe el producto a eliminar");
      }
    }

    saveProducts(products) {
        fs.writeFileSync(this.#path, JSON.stringify(this.products), 'utf-8');
        console.log('productos guardados en el archivo');
    }

}

module.exports = ProductManager;
