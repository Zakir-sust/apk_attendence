const express = require('express')
const router = express.Router();
const ApprovalDh = require('../db/ApprovalDh')
const Dhead = require('../db/Dhead')

router.use(express.json())

router.route('/').get((req, res) => {
    const university = req.query.university
    ApprovalDh.find({ university: university })
        .then(approvals => res.json(approvals))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const newApprovalDh = new ApprovalDh({...req.body });

    try {
        console.log(newApprovalDh)
        await newApprovalDh.save();
        res.status(200).send({ newApprovalDh })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/:secret', async(req, res, next) => {
    Dhead.findOne({
            secret: req.params.secret,
        })
        .then(async(dhead) => {
            if (!dhead) {
                return res.status(404).send({ message: "Department head Not found." });
            }

            if (dhead.status == true) throw new Error('request send already')

            dhead.status = true;
            await dhead.save(async(err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                const id = dhead._id
                const university = dhead.university
                const department = dhead.department
                const newApprovalDh = new ApprovalDh({ id, university, department });
                try {
                    if (dhead.activated == true) throw new Error('this account is already acticated')
                    console.log(newApprovalDh)
                    await newApprovalDh.save();
                    res.status(200).send({ newApprovalDh })
                } catch (e) {
                    res.status(400).send(e);
                }

            });
        })
        .catch((e) => console.log("error", e));
})

router.get('/:id', async(req, res) => {
    try {
        const approvalDh = await ApprovalDh.findById({ _id: req.params.id })
        if (!approvalDh)
            return res.status(404).send()
        res.status(200).send(approvalDh)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const approvalDh = await ApprovalDh.findByIdAndDelete(req.params.id)
        if (!approvalDh)
            return res.status(404).send()
        res.status(200).send(approvalDh)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router