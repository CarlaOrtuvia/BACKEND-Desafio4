import express from "express";
import viewRouter from "./router/view.routes.js"
import productsRouter from './router/product.routes.js';
import cartRouter from './router/cart.routes.js';
import {__dirname} from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./manager/products.manager.js";

const app = express()
console.log(__dirname)
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views",__dirname+"/views");


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use("/", viewRouter);


const PORT = 3001;

const httpServer = app.listen(PORT, ( )=>{
     console.log(`Server ok en puerto: ${PORT}`)
});


const pmanager=new ProductManager(__dirname+"/files/products.json")
 const socketServer = new Server(httpServer)

socketServer.on("connection",async (socket)=>{
    console.log("cliente conectado con id:" ,socket.id)
    const products = await pmanager.getAllProducts({});
    socketServer.emit('productos', products);

    socket.on('createProducts', async data => {
        await pmanager.createProducts(data);
        const updatedProducts = await pmanager.getAllProducts({});
    socketServer.emit('productosupdated', updatedProducts);
      });

      socket.on("deleteProduct", async (id) => {
        console.log("ID del producto a eliminar:", id);
         await pmanager.deleteProductsById(id);
        const deletedProduct = await pmanager.getAllProducts({});
        socketServer.emit("productosdeleted", deletedProduct);
      });
     
        
     

})