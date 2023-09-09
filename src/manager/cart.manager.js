import fs from "fs";


export default class cartManager{
    constructor(path){
        this.path = path;
    }
    async #getMaxCartId() {
        let maxCartId = 0;
        const carts = await this.getAllCarts();
        carts.forEach((cart) => {
            if (cart.id > maxCartId) maxCartId = cart.id;
        });
        return maxCartId;
    }
    async createCart() {
        try {
            const cartId = await this.#getMaxCartId();
            const newCart = {
                id: cartId,
                products: []
            };

            const carts = await this.getAllCarts();
            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return newCart;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(carts);
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getCartProducts(cartId) {
        try {
            const carts = await this.getAllCarts();
            const cart = carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error(`Cart id ${cartId} not found`);
            }

            return cart.products;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    
    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.getAllCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            if (cartIndex === -1) {
                throw new Error(`Cart id ${cartId} not found`);
            }

            const product = {
                id: productId,
                quantity: parseInt(quantity)
            };

            const existingProductIndex = carts[cartIndex].products.findIndex(p => p.id === productId);
            if (existingProductIndex !== -1) {
             carts[cartIndex].products[existingProductIndex].quantity += product.quantity;
            } else {
                carts[cartIndex].products.push(product);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts));
        } catch (error) {
            console.log(error);
        }
    }
}