import { checkUpdateClient } from '../../utils/validator.js'
import Category from '../category/category.model.js'
import Product from '../product/product.model.js'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const add = async (req, res) => {
    try {
        let data = req.body
        let existingCategory = await Category.findOne({ name: data.name });
        if (existingCategory) {
            return res.status(400).send({ message: 'Category with this name already exists' });
        }

        let category = new Category(data)
        await category.save()
        return res.send({ message: 'a new category was created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'saving erro' })
    }
}

export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdateClient(data, id)
        if (update === false) return res.status(400).send({ message: 'enter all data' })
        let updateCat = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCat) return res.status(401).send({ message: 'Category not found and not updated' })
        return res.send({ message: 'Updated category', updateCat })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'error updating' })

    }
}

export const deleted = async (req, res) => {
    try {
        let { id } = req.params;
        
        // Buscar la categoría que se va a eliminar
        let categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).send({ message: 'The category does not exist' });
        }

        // Buscar la categoría 'default'
        let defaultCategory = await Category.findOne({ name: 'Default' });
        if (!defaultCategory) {
            return res.status(404).send({ message: 'Default category not found' });
        }

        // Actualizar los productos relacionados a la categoría que se está eliminando
        let updateProducts = await Product.updateMany(
            { category: categoryToDelete._id },
            { $set: { category: defaultCategory._id } }
        );

        // Eliminar la categoría
        let deleteCategory = await Category.findOneAndDelete({ _id: id });
        if (!deleteCategory) {
            return res.status(404).send({ message: 'Error when deleting category' });
        }

        return res.send({ message: `Category with name ${deleteCategory.name} deleted successfully` });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

export const find = async (req, res) => {
    try {
        let data = await Category.find()
        return res.send({data})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}

export const defaultCategory = async () => {
    try {
        const existingCategory = await Category.findOne({ name: 'Default' });

        if (existingCategory) {
            return; 
        }
        let data = {
            name: 'Default',
            description: 'default'
        }

        let category = new Category(data)
        await category.save()

    } catch (error) {
        console.error(error)
    }
}