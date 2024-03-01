import Category from '../category/category.model.js'
import Product from '../product/product.model.js'
import { checkUpdateClient } from '../../utils/validator.js'
import Bill from '../bill/bill.model.js'
import mongoose from 'mongoose';


export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const add = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'a new product was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'saving error' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdateClient(data, false)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updatePro = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('category')
        if (!updatePro) return res.status(401).send({ message: 'Product not found and not updated' })
        return res.send({ message: 'Updated product', updatePro })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'error updating' })
    }
}

export const deleted = async (req, res) => {
    try {
        let { id } = req.params
        let deleteProduct = await Product.findOneAndDelete({ _id: id })
        if (!deleteProduct) return res.status(404).send({ message: 'the product does not exist' })
        return res.send({ message: `product with name ${deleteProduct.name} deleted successfully` })
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'error when deleting checl' })
    }
}

export const search = async (req, res) => {
    try {
        let { search } = req.params
        let product = await Product.find({ name: search }).populate('category')
        if (!product) return res.status(404).send({ message: 'product not found' })
        return res.send({ message: 'product found', product })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'error when searching for the product' })
    }
}

export const catalogue = async (req, res) => {
    try {
        let data = await Product.find().populate('category')
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}

export const exhausted = async (req, res) => {
    try {
        let data = await Product.findOne({ stock: 0 }).populate('category')
        if (!data) return res.status(444).send({ message: "there are no products out of stock" })
        return res.send({ data })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}



export const bestSellingProducts = async (req, res) => {
    try {
        const bestSellingProducts = await Bill.aggregate([
            { $unwind: "$items" },
            // Agrupamos por el ID del producto y sumamos la cantidad vendida
            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]);

        const productsDetails = await Product.find({ _id: { $in: bestSellingProducts.map(item => item._id) } });

        // Combinamos la información de los productos más vendidos y sus detalles
        const bestSellingProductsDetails = bestSellingProducts.map(item => {
            const productDetail = productsDetails.find(product => product._id.toString() === item._id.toString());
            return {
                product: productDetail,
                totalQuantity: item.totalQuantity
            };
        });

        return res.status(200).send(bestSellingProductsDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error retrieving best selling products', error: error });
    }
}

export const filterByCategory = async (req, res) => {
    try {
        let { id } = req.params;

        // Verificamos si el categoryId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid category ID' });
        }

        // Buscamos los productos que pertenecen a la categoría especificada
        let products = await Product.find({ category: id });

        return res.status(200).send(products);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error retrieving products by category', error: error });
    }
};

