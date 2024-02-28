import Bill from './bill.model.js'

export const getBestSellingProducts = async (req, res) => {
    try {
        const bestSellingProducts = await Bill.aggregate([
            // Desagregamos los elementos del array "items" para obtener un documento por cada elemento
            { $unwind: "$items" },
            // Agrupamos por el ID del producto y sumamos la cantidad vendida
            { $group: {
                _id: "$items.product",
                totalQuantity: { $sum: "$items.quantity" }
            }},
            // Ordenamos en orden descendente por la cantidad total vendida
            { $sort: { totalQuantity: -1 } },
            // Limitamos el resultado a los primeros N productos más vendidos (por ejemplo, los 10 más vendidos)
            { $limit: 10 }
        ]);

        // Podemos mapear los resultados para obtener información adicional de cada producto si es necesario
        // Por ejemplo, podemos buscar los detalles de cada producto en la colección de productos
        // Aquí, suponemos que los detalles del producto están en la colección de productos "Product"
        const productsDetails = await Product.find({ _id: { $in: bestSellingProducts.map(item => item._id) } });

        // Combinamos la información de los productos más vendidos y sus detalles
        const bestSellingProductsDetails = bestSellingProducts.map(item => {
            const productDetail = productsDetails.find(product => product._id.toString() === item._id.toString());
            return {
                product: productDetail,
                totalQuantity: item.totalQuantity
            };
        });

        return res.status(200).json(bestSellingProductsDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving best selling products', error: error });
    }
};