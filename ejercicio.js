const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            
            console.error("Error al cargar productos:", error.message);
            return [];
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar productos:", error.message);
        }
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || isNaN(price) || !thumbnail || !code || isNaN(stock)) {
            console.error("Campos inválidos o faltantes.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error("Ya existe un producto con ese código.");
            return;
        }

        const product = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };
        this.products.push(product);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.code === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }

    updateProduct(id, newData) {
        const productIndex = this.products.findIndex(product => product.code === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newData };
            this.saveProducts();
            console.log("Producto actualizado:", this.products[productIndex]);
        } else {
            console.error("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.code !== id);
        if (this.products.length === initialLength) {
            console.error("Producto no encontrado.");
        } else {
            this.saveProducts();
            console.log("Producto eliminado con éxito.");
        }
    }
}

// Pruebas
const filePath = 'products.json';
const manager = new ProductManager(filePath);
manager.addProduct("Producto 1", "Descripción del primer producto", 33, "imagen1.jpg", "001", 10);
manager.addProduct("Producto 2", "Descripción del segundo producto", 59, "imagen2.jpg", "002", 15);

console.log(manager.getProducts());

// Actualizar el producto 
manager.updateProduct("001", { title: "Nuevo Producto 1", price: 100 });

console.log(manager.getProducts());

// Eliminar el producto 
manager.deleteProduct("001");

console.log(manager.getProducts());