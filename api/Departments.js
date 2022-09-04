const express = require('express')
const router = express.Router();
const Departments = require('../db/Departments')

router.use(express.json())

router.route('/').get((req, res) => {
    Departments.find()
        .then(university => res.json(university))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const Department = new Departments({...req.body });

    try {
        console.log(Department)
        await Department.save();
        res.status(200).send({ Department })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const Department = await Departments.findById({ _id: req.params.id })
        if (!Department)
            return res.status(404).send()
        res.status(200).send(Department)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const Department = await Departments.findByIdAndDelete(req.params.id)
        if (!Department)
            return res.status(404).send()
        res.status(200).send(Department)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router