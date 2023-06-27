const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.get("/", authorization, async (req,res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE user_id = $1",[req.user]);
        res.json({user:user.rows[0], info:"cześć"})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server error")
    }
})

router.get("/expenses", authorization, async (req,res) => {
    try {
        const {rows} = await pool.query("SELECT * FROM expenses WHERE user_id = $1",[req.user]);
        res.json({expenses:rows})
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server error") 
    }
})

module.exports = router;