//adapted from https://github.com/visionmedia/node-basic-auth

module.exports = {
    beforePhantomRequest: function(req, res, next) {
        
        var authEnabled = process.env.AUTH_ENABLED
        if(authEnabled == 0) return next();

        var auth = req.headers.authorization;
        if (!auth) return this.fail(req, res, next);

        // malformed
        var parts = auth.split(' ');
        if ('basic' != parts[0].toLowerCase()) return this.fail(req, res, next);
        if (!parts[1]) return this.fail(req, res, next);
        auth = parts[1];

        // credentials
        auth = new Buffer(auth, 'base64').toString();
        auth = auth.match(/^([^:]+):(.+)$/);
        if (!auth) return this.fail(req, res, next);

        if (!this.isAuthorized(auth[1], auth[2])) return this.fail(req, res, next);

        req.prerender.authentication = { name: auth[1], password: auth[2] };

        return next();
    },

    fail: function(req, res, next) {
        res.send(401, 'Unauthorized');
    },

    isAuthorized: function(username, password) {
        const serverUserName = process.env.BASIC_AUTH_USERNAME || 'PrerenderUserName'
        const serverPassword = process.env.BASIC_AUTH_PASSWORD || 'PrerenderP@$$w0rd'

        if(username === serverUserName && password === serverPassword) return true;
    }
}