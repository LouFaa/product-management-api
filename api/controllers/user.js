var { Request, Response } = require('express');
var { User } = require('../models/user');
var { openConnection, closeConnection, is_connected } = require('../helpers/database')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

/**
*
* @param {Request} req
* @param {Response} res
*/


async function signup(req, res) {
    openConnection()
  
    let email = req.body.email
        User.findOne({ $or: [{ email: email }] }, async (err, user) => {
            if (err != null) {
                res.status(300).json();
                closeConnection();
                return;
            }
            else if (user != null) {

                res.status(200).json({ message: 'votre compte  existe déja veuillez nous contactez' })
                return;
            }
            else {
                let user = new User()
                user.email = req.body.email
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                user.password = hashedPassword 
                user.role = req.body.role
                user.save().then(result => {
                    res.status(200).json(result)
                }).catch(err => {
                    res.status(300).json(err)
                })
                if (is_connected) closeConnection();
                return;
            }
        })
    } 



async function login(req, res) {

    openConnection()
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        const accessToken = jwt.sign({ email: user.email, role: user.role }, 'x-product-token');
    res.json({ accessToken });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    

    if (is_connected) closeConnection()
}



/**
*
*
*
* @param {Request} req
* @param {Response} res
*/

module.exports = {
    signup: signup,
    login: login,
   

}