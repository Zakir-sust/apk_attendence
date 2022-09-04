const express = require('express')
const router = express.Router();
const Course = require('../db/Course')

router.use(express.json())

router.route('/').get((req, res) => {
    Course.find()
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/session').get((req, res) => {
    const session_id = req.query.session_id
    Course.find({ session_id: session_id })
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const course = new Course({...req.body });

    try {
        console.log(course)
        await course.save();
        res.status(200).send({ course })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const course = await Course.findById({ _id: req.params.id })
        if (!course)
            return res.status(404).send()
        res.status(200).send(course)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)
        if (!course)
            return res.status(404).send()
        res.status(200).send(course)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router