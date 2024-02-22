import { generateJwt } from '../../utils/jwt.js'
import { comparePassword, encrypt, checkUpdateClient, checkUpdateAdmin } from '../../utils/validator.js'
import User from '../user/user.model.js'
import jwt from 'jsonwebtoken'

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'test good' })
}

export const signUp = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const signUpAdmin = async (req, res) => {
    try {
        let data = req.body
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        data.role = 'ADMIN'
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let user = await User.findOne({ username })
        if (user && await comparePassword(password, user.password)) {
            let loggedUser = {
                uid: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token })

        }
        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async (req, res) => {
    try {
        let { token } = req.headers
        let { id } = req.params
        let data = req.body
        if (!token) return res.status(401).send({ message: `Token is required. | Login required.` })
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY)

        switch (role) {
            case 'ADMIN':
                let update = checkUpdateAdmin(data, id)
                if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
                let updatedUser = await User.findOneAndUpdate(
                    { _id: id }, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
                    data, //Los datos que se van a actualizar
                    { new: true } //Objeto de la BD ya actualizado
                )
                if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' })
                return res.send({ message: 'Updated user', updatedUser })
                break;

            case 'CLIENT':
                let updated = checkUpdateClient(data, id)
                if(id !== uid) return  res.status(401).send({ message: 'you can only delete your account' })
                if (!updated) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
                let updatedUsers = await User.findOneAndUpdate(
                    { _id: uid }, //ObjectsId <- hexadecimales (Hora sys, Version Mongo, Llave privada...)
                    data, //Los datos que se van a actualizar
                    { new: true } //Objeto de la BD ya actualizado
                )
                if (!updatedUsers) return res.status(401).send({ message: 'User not found and not updated' })
                return res.send({ message: 'Updated user', updatedUsers })
                break;
        }

    } catch (err) {
        console.error(err)
        if (err.keyValue.username) return res.status(400).send({ message: `Username ${err.keyValue.username} is alredy taken` })
        return res.status(500).send({ message: 'Error updating account' })
    }
}

export const deleted = async (req, res) => {
    try {
        let { token } = req.headers
        let { id } = req.params
        let { validationWord } = req.body
        if (!token) return res.status(401).send({ message: `Token is required. | Login required.` })
        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY);

        switch (role) {
            case 'ADMIN':
                if (!validationWord) return res.status(400).send({ message: `valitaion word IS REQUIRED.` });
                if (validationWord !== 'CONFIRM') return res.status(400).send({ message: `valitaion word must be -> CONFIRM` });
                let deletedUser = await User.findOneAndDelete({ _id: id })
                if (!deletedUser) return res.status(404).send({ message: 'Account not found and not deleted' })
                return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` }) //status 200
                break;

            case 'CLIENT':
                if (!validationWord) return res.status(400).send({ message: `valitaion word IS REQUIRED.` });
                if (validationWord !== 'CONFIRM') return res.status(400).send({ message: `valitaion word must be -> CONFIRM` });
                if(id !== uid) return  res.status(401).send({ message: 'you can only delete your account' })
                let deletedUsers = await User.findOneAndDelete({ _id: uid })
                if (!deletedUsers) return res.status(404).send({ message: 'Account not found and not deleted' })
                return res.send({ message: `Account with username ${deletedUsers.username} deleted successfully` }) //status 200
                break;
        }

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })
    }
}