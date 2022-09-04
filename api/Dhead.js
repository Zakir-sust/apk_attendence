const express = require('express')
const router = express.Router();
const Dhead = require('../db/Dhead');
const authDhead = require('../middleware/authDhead');
const auth = require('../middleware/authDhead')

const ApprovalDh = require('../db/ApprovalDh')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;

router.use(express.json())
router.route('/').get((req, res) => {
    const university = req.query.university
    Dhead.find({ university: university })
        .then(dheads => res.json(dheads))
        .catch(err => res.status(400).json('Error: ' + err));
})



router.get('/me', authDhead, async(req, res) => {
    try {
        res.status(200).send(req.dhead)
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
          <p>http://localhost:5000/approveDh/${secret}</p>
          </div>`,
    }).catch(err => console.log('errr ', err));
};


router.post('/add', async(req, res) => {
    const phone = req.body.phone;
    const name = req.body.name;
    const university = req.body.university;
    const department = req.body.department;
    const email = req.body.email;
    const activated = false;
    const password = req.body.password;
    const post = 'department_head'
    const status = false
    const secret = await jwt.sign({ email: email }, 'thisisnewdhead')

    try {
        Dhead.findOne({ email: email }, function(err, dhead) {
            console.log('exist ', dhead);
            if (dhead) return
        })
    } catch {
        console.log('dhead is used')
    }

    const newDhead = new Dhead({ email, name, phone, university, department, post, status, secret, password, activated });
    console.log(newDhead)

    try {
        /*const dhead = await newDhead.enter();
        console.log('dhead', dhead)
        res.status(200).send(dhead)*/

        await newDhead.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            console.log('sending mail')

            sendConfirmationEmail(
                newDhead.name,
                newDhead.email,
                newDhead.secret
            );
        })
        console.log('dheader', newDhead)
        res.status(200).send(newDhead)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }
})

router.route('/login').post(async(req, res) => {
    try {
        const dhead = await Dhead.findByCredentials(req.body.email, req.body.password)
        if (dhead.activated == false) {
            res.status(400).send('Id is not activated')
            throw new Error('Id is not activated')
            return
        }
        const token = await dhead.generateAuthToken()
        console.log(dhead.token)
        const post = dhead.post
        const university = dhead.university
        const department = dhead.department
        const name = dhead.name
        const email = dhead.email
        const id = dhead._id
        res.status(200).send({ dhead, token, post, department, university, name, email, id })
    } catch (e) {
        res.status(400).json(e)
    }
})

router.get('/logout', authDhead, async(req, res) => {
    console.log(req.dhead)
    try {
        req.dhead.tokens = req.dhead.tokens.filter(token => token.token !== req.token)
            //req.user.tokens = []
        await req.dhead.save();
        res.status(200).send(req.dhead)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', async(req, res) => {
    console.log(req.params)
    try {
        const dhead = await Dhead.findById(req.params.id)
        if (!dhead)
            return res.status(404).send()
        res.status(200).send(dhead)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/:id', async(req, res) => {
    try {
        console.log(req.body, req.params.id)
        const dhead = await Dhead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!dhead)
            return res.status(404).send()
        res.status(200).send(dhead)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/:id', async(req, res) => {
    try {
        const dhead = await Dhead.findByIdAndDelete(req.params.id)
        if (!dhead)
            return res.status(404).send()
        res.status(200).send(dhead)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;