const express = require('express')
const Session = require('../models/session')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/sessions', auth, async (req, res) => {
    const session = new Session({
        ...req.body,
        owner: req.user._id
    })

    try {
        await session.save()
        res.status(201).send(session)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /sessions?completed=true
// GET /sessions?limit=10&skip=20
// GET /sessions?sortBy=createdAt:desc
router.get('/sessions', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'sessions',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.sessions)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/sessions/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const session = await Task.findOne({ _id, owner: req.user._id })

        if (!session) {
            return res.status(404).send()
        }

        res.send(session)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/sessions/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const session = await Session.findOne({ _id: req.params.id, owner: req.user._id})

        if (!session) {
            return res.status(404).send()
        }

        updates.forEach((update) => session[update] = req.body[update])
        await session.save()
        res.send(session)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/sessions/:id', auth, async (req, res) => {
    try {
        const session= await Session.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!session) {
            res.status(404).send()
        }

        res.send(session)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router