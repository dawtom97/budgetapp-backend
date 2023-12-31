const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validationInfo = require("../middleware/validationInfo");
const authorization = require("../middleware/authorization");

router.post("/register", validationInfo, async (req,res) =>{
    try {
      const {name,email,password} = req.body;

      // Sprawdzamy czy email istnieje
      const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);
      if(user.rows.length !== 0) {
        return res.status(401).send("User already exists");
      }

      //Szyfrowanie hasła
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password,salt);

      const newUser = await pool.query("INSERT INTO users(user_name,user_password,user_email) VALUES ($1,$2,$3) RETURNING *",[name,bcryptPassword,email])
      const token = jwtGenerator(newUser.rows[0].user_id)
     // res.status(200).send("New user created")
    
      res.json({token})
    } catch (error) {
      console.log(error.message)
      res.status(500).send("Server Error");
    }
})

// LOGIN
router.post("/login", validationInfo, async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1",[email]);
        if(user.rows.length === 0) {
            return res.status(401).json("Email is incorrect")
        }
        const validPassword = await bcrypt.compare(password,user.rows[0].user_password);
        if(!validPassword) {
            return res.status(401).json("Incorrect password")
        }
        const token = jwtGenerator(user.rows[0].user_id);
        res.json({token})
    } catch (error) {
        console.log(error.message);
    }
    
})

router.get("/is-verify", authorization, async (req,res) => {
    try {
        res.json(true);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error")
    }
})


module.exports = router;