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

router.delete("/expenses-delete", authorization, async (req,res) => {
    try {
       const {id} = req.body;
       const expense = await pool.query("DELETE FROM expenses WHERE expense_id = $1",[id]);
       res.json({success:true,message:"Expense deleted successfully"})
    } catch (error) {
       console.log(error.message);
       res.status(500).json({success:false,message:"Expense doesnt exists"}) 
    }
})

router.patch("/expenses-edit", authorization, async (req,res) => {
    try {
        const {category,title,amount,id} = req.body;
        console.log(req.body)
        const expense = await pool.query("UPDATE expenses SET expense_title = $1, expense_category = $2, expense_amount = $3, expense_date = CURRENT_DATE WHERE expense_id = $4",[title,category,amount,id]);
        res.json({success:true,message:"Expense edited successfully"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success:false,message:"Expense doesnt exists"})
    }
})


module.exports = router;