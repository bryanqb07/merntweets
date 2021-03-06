const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require("passport");
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


// test route for jwt token auth

router.get("/current", passport.authenticate('jwt', {session: false}, (req,res) =>{
    res.json({
        id: req.user.id,
        handle: req.user.handle,
        email: req.user.email
    });
}));

router.post("/register", (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    // first check if user already exists
    User.findOne({email: req.body.email})
        .then(user =>{
            if(user){
                //throw 400 error if email already exists
                return res.status(400).json({email: "A username has already been registered with this address"});
            }else{
                //otherwise create a new user
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password
                });
                // then encrypt the info
                bcrypt.genSalt(10, (err,salt) =>{
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                //generate session token
                                const payload = { id: user.id, name: user.name };

                                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                });
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });

});

router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user){
                errors.name = "User does not exist";
                return res.status(404).json(errors);
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {id: user.id, name: user.name};
                        jwt.sign(payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });
                    }else{
                        errors.password = "Incorrect password";
                        return res.status(400).json(errors);
                    }
                
                });

        });
});

module.exports = router;