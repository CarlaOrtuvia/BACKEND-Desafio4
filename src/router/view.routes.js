import { Router } from "express";
import ProductManager from "../manager/products.manager.js";
import { __dirname } from "../utils.js";

const pmanager = new ProductManager(__dirname+'/files/products.json')

const router = Router();

router.get ("/",async(req,res)=>{
    const listaproductos=await pmanager.getAllProducts({})
    res.render("home",{listaproductos})
  })

router.get("/realtimeproducts", (req, res) =>{
    res.render("realtimeproducts")
})
export default router; 