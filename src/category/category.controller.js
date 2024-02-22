import { checkUpdateClient } from '../../utils/validator.js'
import Category from '../category/category.model.js'

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
        let { id } = req.params
        let deleteCategory = await Category.findOneAndDelete({ _id: id })
        if (!deleteCategory) return res.status(404).send({ message: 'the category does not exist' })
        return res.send({ message: `category with name ${deleteCategory.name} deleted successfully` })
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'error when deleting check' })
    }
}

export const find = async (req, res) => {
    try {
        let data = await Category.find()
        return res.send({data})
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'the information cannot be brought' })
    }
}