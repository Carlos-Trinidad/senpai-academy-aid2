const getPing = async (req, res) => {
    res.status(200);
    res.send({
        success: true,
        message: 'pong',
        body: req.body,
        query: req.query,
        ip: req.ip,
        hostname: req.hostname
    });
}


module.exports = {
    getPing
}