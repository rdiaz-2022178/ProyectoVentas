import Shopping from './shopping.model.js'
import jwt from 'jsonwebtoken'
import Product from '../product/product.model.js'
import Bill from '../bill/bill.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const add = async (req, res) => {
    try {
        let { product, quantity } = req.body;
        let { token } = req.headers;
        let { completeShop } = req.body;

        if (!token) {
            return res.status(401).send({ message: `Token is required. | Login required.` });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        if (!completeShop) {
            let shopping = await Shopping.findOne({ user: uid });

            if (!shopping) {
                const newShopping = new Shopping({
                    user: uid,
                    products: [{ product: product, quantity }],
                    total: 0 // Inicializamos el total en 0
                });
                await newShopping.save();
                return res.status(200).send({ message: 'Product added to shopping cart successfully.' });
            }

            // Verificamos si el producto ya está en el carrito
            const productIndex = shopping.products.findIndex(p => p.product.equals(product));

            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, simplemente actualizamos la cantidad
                shopping.products[productIndex].quantity += parseInt(quantity);
            } else {
                // Si el producto no está en el carrito, lo agregamos
                shopping.products.push({ product: product, quantity });
            }

            // Calculamos el total del carrito
            let total = 0;
            for (const product of shopping.products) {
                const productData = await Product.findById(product.product);
                if (productData) {
                    total += productData.price * product.quantity;
                }
            }
            shopping.total = total;

            await shopping.save();
            return res.status(200).send({ message: 'Product added to shopping cart successfully.' });
        } else {
            if (completeShop !== 'CONFIRM') return res.status(400).send({ message: `Validation word must be -> CONFIRM` });

            const shopping = await Shopping.findOne({ user: uid });

            if (!shopping) {
                return res.status(400).send({ message: 'Shopping cart is empty.' });
            }

            // Crear un nuevo registro de factura con los datos del carrito de compras
            const billItems = [];
            for (const item of shopping.products) {
                const productData = await Product.findById(item.product);
                if (productData) {
                    billItems.push({
                        product: item.product,
                        quantity: item.quantity,
                        unitPrice: productData.price, // Precio unitario del producto
                        totalPrice: productData.price * item.quantity // Precio total del producto
                    });
                }
            }

            const bill = new Bill({
                user: shopping.user,
                items: billItems,
                totalAmount: shopping.total
            });
            const savedBill = await bill.save();

            // Actualizar el stock de los productos
            for (const item of shopping.products) {
                const productData = await Product.findById(item.product);
                if (productData) {
                    productData.stock -= item.quantity;
                    await productData.save();
                }
            }

           
            await Shopping.deleteOne({ _id: shopping._id });


            return res.status(200).send({ message: 'Purchase completed successfully and bill generated.', bill: savedBill });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error registering ', error: error });
    }
}