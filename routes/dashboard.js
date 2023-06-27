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

router.get("/expenses-sum", authorization, async (req,res) => {
    try {
        const {rows} = await pool.query("SELECT SUM(expense_amount) FROM expenses WHERE user_id = $1",[req.user]);
        res.json({balance:rows[0]})
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server error") 
    }
})

router.post("/expenses-add", authorization, async (req,res) => {
    try {
        const {category,title,amount} = req.body;
        const {rows} = await pool.query("INSERT INTO expenses(user_id, expense_category, expense_title, expense_amount, expense_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *",[req.user,category, title,amount ]);

        res.json({expense:rows[0], success:true});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false}) 
    }
})


module.exports = router;