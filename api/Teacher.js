const express = require('express')
const router = express.Router();
const Teacher = require('../db/Teacher');
const authTeacher = require('../middleware/authTeacher')

const ApprovalT = require('../db/ApprovalT')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


router.use(express.json())
router.route('/').get((req, res) => {
    const university = req.query.university
    const department = req.query.department
    Teacher.find({ university: university, department: department })
        .then(teachers => res.json(teachers))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/me', authTeacher, async(req, res) => {
    try {
        console.log(req.teacher)
        res.status(200).send(req.teacher)
    } catch (e) {
        res.status(500).send()
    }
})

const nodemailer = require("nodemailer");
const config = require("../config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});

const ip = require('../ip')

const sendConfirmationEmail = (name, email, secret) => {
    console.log("Check ", secret, user, email, pass);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<div>
          <h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <p>http://localhost:5000/approveT/${secret}</p>
          </div>`,
    }).catch(err => console.log('errr ', err));
};


router.post('/add', async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const university = req.body.university;
    const department = req.body.department;
    const password = req.body.password;
    const post = 'teacher'
    const activated = false
    const status = false
    const secret = await jwt.sign({ email: email }, 'thisisnewteacher')

    try {
        Teacher.findOne({ email: email }, function(err, teacher) {
            console.log(teacher);
            // 123456

            if (teacher) console.log('fine one lol')
                /* if (err) return res.redirect('/signupform') */

            if (teacher) {
                console.log('just stop it')
                console.log('This teacher is used')
                return
            }
        })
    } catch {
        console.log('teacher is used')
    }

    let newTeacher = new Teacher({ email, name, phone, university, secret, department, post, status, activated, password });
    console.log('new ', newTeacher)

    try {
        await newTeacher.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            console.log('sending mail')

            sendConfirmationEmail(
                newTeacher.name,
                newTeacher.email,
                newTeacher.secret
            );
        })
        console.log('Teacher', newTeacher)
        res.status(200).send(newTeacher)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }
})

router.route('/login').post(async(req, res) => {
    try {
        let teacher = await Teacher.findByCredentials(req.body.email, req.body.password)
        console.log(teacher)
        if (teacher.activated == false) {
            res.status(400).send('Id is not activated')
            throw new Error('Id is not activated')
            return
        }
        const token = await teacher.generateAuthToken()
        const post = teacher.post
        const university = teacher.university
        const department = teacher.department
        const name = teacher.name
        const email = teacher.email
        const id = teacher._id
        console.log(teacher)
        res.status(200).send({ teacher, token, post, department, university, name, email, id })
    } catch (e) {
        console.log(e.message)
        res.status(400).json(e)
    }
})

router.get('/logout', authTeacher, async(req, res) => {
    console.log(req.teacher)
    try {
        req.teacher.tokens = req.teacher.tokens.filter(token => token.token !== req.token)
            //req.user.tokens = []
        await req.teacher.save();
        res.status(200).send(req.teacher)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', async(req, res) => {
    console.log(req.params)
    try {
        const teacher = await Teacher.findById(req.params.id)
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/:id', async(req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/:id', async(req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id)
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;