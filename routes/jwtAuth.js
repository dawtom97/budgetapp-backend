const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");


router.post("/register", async (req,res) =>{
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

      const newUser = await pool.query("INSERT INTO users(user_name,user_password,user_email) VALUES ($1,$2,$3)",[name,bcryptPassword,email])
      res.json({newUser})
    } catch (error) {
      console.log(error.message)
    }
})


module.exports = router;