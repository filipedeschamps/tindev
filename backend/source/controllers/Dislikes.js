const Dev = require('../models/Dev.js')

module.exports = {
    async store(request, response) {
        const { devId } = request.params
        const { user } = request.headers

        const loggedDev = await Dev.findById(user)
        const targetDev = await Dev.findById(devId)

        if (!targetDev) {
            return response.status(400).json({ error: 'Dev not found'})
        }

        loggedDev.dislikes.push(targetDev._id)

        await loggedDev.save()

        console.log(`User ${loggedDev.user} disliked ${targetDev.user}`)

        return response.json(loggedDev)
    }
}