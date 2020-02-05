function isAuth(req, res, next)
{
    if (req.isAuthenticated())
        next()
    else
        res.json({"auth": false, "message": "User is not authenticated."});

}

module.exports = isAuth

