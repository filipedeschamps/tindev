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

        loggedDev.likes.push(targetDev._id)

        await loggedDev.save()

        console.log(`User ${loggedDev.user} liked ${targetDev.user}`)

        /* This could be a performance issue, since `includes` method is
         * O(n), for a large set of users this could turn to be an overhead.
         *
         * It would need to have some optimizations here in order to
         * this to be fast enough.
         */
        if (targetDev.likes.includes(loggedDev._id)) {
            console.log('QUE MASSA DEU MATCH!')
            const loggedSocket = request.connectedUsers[user]
            const targetSocket = request.connectedUsers[devId]

            if (loggedSocket) {
                request.io.to(loggedSocket).emit('match', targetDev)
            }

            if (targetSocket) {
                request.io.to(targetSocket).emit('match', loggedDev)
            }
        }

        return response.json(loggedDev)
    }
}