import { Router } from "express";
import CartManager from "../manager/cart.manager.js";
import { __dirname } from "../utils.js";

const cartRouter = Router();

const cartManager = new CartManager(__dirname+"/files/cart.json");

cartRouter.post('/', async(req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouter.get('/:cid', async(req, res) => {
    try {
        const { cid } = req.params;
        const cartProducts = await cartManager.getCartProducts(cid);
        res.status(200).json(cartProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

cartRouter.post('/:cid/product/:pid', async(req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        await cartManager.addProductToCart(cid, pid, quantity);
        res.status(201).send(`Product ${pid} added to cart ${cid}`);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default cartRouter