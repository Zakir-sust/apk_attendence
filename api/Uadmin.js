const express = require('express')
const router = express.Router();
const UAdmin = require('../db/Uadmin');
const authUAdmin = require('../middleware/authUadmin');
const auth = require('../middleware/authUadmin')
const Approval = require('../db/Approval')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;

router.use(express.json())
router.route('/').get((req, res) => {
    UAdmin.find()
        .then(admins => res.json(admins))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/uu').get((req, res) => {
    const uni = req.query.university
    UAdmin.find({ university: uni })
        .then(admins => res.json(admins))
        .catch(err => res.status(400).json('Error: ' + err));
})
router.get('/me', authUAdmin, async(req, res) => {
    try {
        res.status(200).send(req.uadmin)
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
    console.log("Check ", secret, user, email);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<div>
          <h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <p>http://localhost:5000/approve/${secret}</p>
          </div>`,
    }).catch(err => console.log('errr ', err));
};



router.post('/add', async(req, res) => {
    const phone = req.body.phone;
    const name = req.body.name;
    const university = req.body.university;
    const email = req.body.email;
    const activated = false;
    const password = req.body.password;
    const post = 'university_admin'
    const status = false;
    const secret = await jwt.sign({ email: email }, 'thisisnewuadmin')

    try {
        UAdmin.findOne({ email: email }, function(err, admin) {
            console.log('exist ', admin);
            if (admin) return
        })
    } catch {
        console.log('uadmin is used')
    }

    const newUAdmin = new UAdmin({ email, name, phone, university, post, password, activated, status, secret });
    console.log(newUAdmin)
        /* if (newUAdmin.isModified('password')) {
             newUAdmin.password = await bcrypt.hash(UAdmin.password, 8);
         }*/

    try {
        await newUAdmin.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            console.log('sending mail')

            sendConfirmationEmail(
                newUAdmin.name,
                newUAdmin.email,
                newUAdmin.secret
            );
        })
        console.log('uadmin', newUAdmin)
        res.status(200).send(newUAdmin)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }
})

router.route('/login').post(async(req, res) => {
    try {
        const uadmin = await UAdmin.findByCredentials(req.body.email, req.body.password)
        console.log('init ', uadmin)
        if (uadmin.activated == false) {
            res.status(400).send('Id is not activated')
            throw new Error('Id is not activated')
            return
        }
        console.log('activated is true')
        const token = await uadmin.generateAuthToken()
        console.log(uadmin.token)
        const post = uadmin.post
        const university = uadmin.university
        const name = uadmin.name
        const email = uadmin.email
        const id = uadmin._id
        res.status(200).send({ uadmin, token, post, university, name, email, id })
    } catch (e) {
        res.status(400).json(e)
    }
})

router.get('/logout', authUAdmin, async(req, res) => {
    console.log(req.uadmin)
    try {
        req.uadmin.tokens = req.uadmin.tokens.filter(token => token.token !== req.token)
            //req.user.tokens = []
        await req.uadmin.save();
        res.status(200).send(req.uadmin)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', async(req, res) => {
    console.log(req.params)
    try {
        const uadmin = await UAdmin.findById(req.params.id)
        if (!uadmin)
            return res.status(404).send()
        res.status(200).send(uadmin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/:id', async(req, res) => {
    try {
        console.log(req.body, req.params.id)
        const admin = await UAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!admin)
            return res.status(404).send()
        res.status(200).send(admin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/:id', async(req, res) => {
    try {
        const admin = await UAdmin.findByIdAndDelete(req.params.id)
        if (!admin)
            return res.status(404).send()
        res.status(200).send(admin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;