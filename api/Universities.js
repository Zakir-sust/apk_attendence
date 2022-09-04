const express = require('express')
const router = express.Router();
const Universities = require('../db/Universities')

router.use(express.json())

router.route('/').get((req, res) => {
    Universities.find()
        .then(university => res.json(university))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    console.log(req.body)
    const key = req.body.university
    const University = new Universities({...req.body, key });

    try {
        console.log(University)
        await University.save();
        res.status(200).send({ University })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const University = await Universities.findById({ _id: req.params.id })
        if (!University)
            return res.status(404).send()
        res.status(200).send(University)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const University = await Universities.findByIdAndDelete(req.params.id)
        if (!University)
            return res.status(404).send()
        res.status(200).send(University)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router