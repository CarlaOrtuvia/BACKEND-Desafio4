import { Router } from "express";
import ProductManager from "../manager/products.manager.js";
import { __dirname } from "../utils.js";
const router = Router();

const productManager = new ProductManager(__dirname+"/files/products.json");

router.get('/', async(req, res)=> {
     try {
          const products = await productManager.getAllProducts()
          res.status(200).json(products);
          
     } catch (error) {
          res.status(404).json({message: error.message});
          console.log(error);          
     }
});

router.get('/:id', async(req, res) =>{
     try {
     const { id } = req.params;
     const product = await productManager.getProductsById(Number(id));
     if(product){
          res.status(200).json({message:'Product found', product })
     } else {
          res.status(400).send('product not found')
     }          
     } catch (error) {
          res.status(404).json({message: error.message})
          
     }
});
router.post('/', async(req, res) =>{
     try {
          console.log(req.body);
          const product = req.body;
         const newProduct = await productManager.createProducts(product);
         res.json(newProduct);
     } catch (error) {
          res.status(404).json({message: error.message})
     }
} )
router.put('/:id', async(req, res) =>{
     try {
          const product = req.body;
          const { id } = req.params;
          const productFile = await productManager.getProductsById(Number(id));
          if(productFile){
               await productManager.updateProducts(product, Number(id));
               res.send(`Product updated successfully`);
          } else {
               res.status(400).send('product not found')
          }
     } catch (error) {
          res.status(404).json({message: error.message})
     }
})
router.delete('/:id', async(req, res) =>{
     try {
         const { id } = req.params;
         const products = await productManager.getAllProducts();
         if(products.length > 0){
          await productManager.deleteProductsById(Number(id));
          res.send(`Product id: ${id} deleted successfuly`)
         } else {
          res.send(`Product id: ${id} not found`);
         }
     } catch (error) {
          res.status(404).json({message: error.message})
     }
})
router.delete('/', async(req,res) =>{
     try {
          await productManager.deleteAllProducts();
          res.send('Products deleted successfully');
     } catch (error) {
          res.status(404).json({message: error.message})
     }
})

export default router ; 