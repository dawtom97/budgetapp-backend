const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorization = async (req,res,next) => {
    try {

        const jwtToken = req.header("token");

        if(!jwtToken) {
            return res.status(403).json("Not authorize 1")
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payload.user;
        
    } catch (error) {
        console.log(error.message);
        return res.status(403).json("Not authorize 2")
    }

    next();
}

module.exports = authorization;