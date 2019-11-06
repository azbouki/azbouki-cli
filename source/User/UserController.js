'use strict'

var moment = require('moment');
var jwt = require('jwt-simple');
var Utils   = require('../lib/utils');
var async   = require('async');
var fs = require('fs');
var config = require('../config');
var fs = require('fs');

let SENDGRID_KEY = config.apiKeys.sendGrid;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_KEY);


module.exports = function UserController(UserRepository, app) {

   async function register(req, res){

       if (!req.body.email || !req.body.password) {
           res.status(400).json({
               success: false,
               msg: "Email or password not provided"
           });
           return;
       }

       try {
           const isExisting = await UserRepository.checkIfUserExists(req.body.email.toLowerCase());

           if (isExisting === true) {
               res.status(400).json({
                   success: false,
                   msg: "User already exists"
               });
           }
           else{
               let user = UserRepository.registerUser({
                   email: req.body.email.toLowerCase(),
                   password: req.body.password
               });

               sendNewUserMail( { email: req.body.email.toLowerCase(), firstName:  req.body.firstName }, token, req.body.redirectUrl, function (error) {
                   if (error) {
                       catchError(res, error);
                       return;
                   }
                   res.json({
                       success: true,
                       user: user
                   });
               });

           }

       } catch(err) {
           catchError(res, err, '---register---')
       }

    }

    function login(req, res, next){
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                success: false,
                msg: "Email or password not provided"
            });
            return;
        }
        UserRepository.loginUser(req.body.email.toLowerCase(), req.body.password).then(function(user){

            attachTokenAndRespond(user, res);
        }).catch(function(err){
            catchError(res, err, '---login---')
        });

    }

    function attachTokenAndRespond(user, res) {
        if (user) {
            var expires = moment().add(7, 'days').valueOf();
            console.log(user.userId);
            var secret = app.get('jwtTokenSecret');
            var token = jwt.encode(
                {
                    iss: user.userId,
                    exp: expires
                },
                app.get('jwtTokenSecret')
            );

            res.json({
                success: true,
                user: user,
                token: token,
                expires: expires
            });
        } else{
            res.status(400).json({
                success: false,
                msg: "Wrong user or password"
            });
        }
    }

    function changePassword(req, res){
        var userData = {
            userId: req.user.id,
            oldPass: req.body.oldPass,
            newPass: req.body.newPass
        };
        UserRepository.checkUserPassword(userData).then(function(isOldPassCorrect){
            if (isOldPassCorrect === true) {
                UserRepository.changePassword(userData).then(function(rr){
                    res.json({
                        success: true
                    });
                }).catch(function(err){
                    catchError(res, err, '---checkUserPass-ChangeUserPass---')
                });
            }
            else{
                res.json({
                    success: false,
                    msg: 'Wrong current password'
                });
            }
        }).catch(function(err){
            catchError(res, err, '---checkUserPassword---')
        });
    }

    function sendNewUserMail(userData, token, redirectUrl, completion) {
        // setup e-mail data with unicode symbol
        const templateFile = "welcome_template"

        const msg = {
            to: userData.email,
            from: '---',
            subject: 'Welcome to ---',
            text: `You can now login to your dashboard!`,
        };
        sgMail.send(msg, (err, result) => {
            completion(err);
            return;
        });

    }

    async function updatePassword(req, res) {

        if (!req.body.password || !req.body.token || !req.body.confirmPassword) {
            catchError(res, "INVALID_FIELDS");
            return;
        }

        if (req.body.password !== req.body.confirmPassword) {
            catchError(res, "PASSWORD_DO_NOT_MATCH");
            return;
        }

        try {
            let user = await UserRepository.findUserByToken(req.body.token);
            if (user) {
                let success = await UserRepository.updatePassword(user.email, req.body.password)
                if (success) {
                    let tokenRemoved = await UserRepository.deleteToken(user.id);
                    res.json({
                        success: tokenRemoved
                    });
                } else {
                    catchError(res, "FAILED_TO_UPDATE");
                }
            } else {
                catchError(res, "EXPIRED_OR_INVALID_TOKEN");
            }
        } catch (err) {
            catchError(res, err, "---update pass----");
        }
    }

    function resetPassword(req, res) {
        createResetToken(req.body.email.toLowerCase(), function (token, error) {
            if (error) {
                // catchError(res, err);
                res.json({
                    success: true
                })
                return;
            }

            if (!token) {
                // catchError(res, "Something went wrong");
                res.json({
                    success: true
                })
                return;
            }

            sendResetPassMail(req.body.email.toLowerCase(), token, req.body.redirectUrl, function (error) {
                if (error) {
                    catchError(res, error);
                    return;
                }
                res.json({
                    success: true
                })
            });
        });
    }

    function createResetToken(userEmail, completion) {
        crypto.randomBytes(20, function (err, buffer) {
            if (err) {
                completion(null, err);
            }
            var token = buffer.toString('hex');
            UserRepository.updateResetToken(userEmail.toLowerCase(), token).then(function (success) {
                if (success) {
                    completion(token, null);
                } else {
                    completion(null, "No such user");
                }
            }).catch(function (err) {
                completion(null, err);
            });
        });
    }

    function sendResetPassMail(userEmail, token, redirectUrl, completion) {

        // setup e-mail data with unicode symbols
        fs.readFile(`${__dirname}/../../templates/reset-password.html`, 'utf8', function (err, tpl) {// TODO: Update template!

            if (err) {
                logger.info(err);
            }
            const html = tpl.replace(/RESET_URL/g, `${redirectUrl}?token=${token}`);

            const mailOptions = {
                from: '"----', // sender address
                to: userEmail, // list of receivers
                subject: 'Your forgotten password request', // Subject line
                // text: 'Hello world 🐴', // plaintext body
                html: html // html body
            };
            transport.sendMail(mailOptions, function (error, info) {
                completion(error);
                logger.info('Message sent: ' + info);
            });
        });
    }



    return {
        register,
        login,
        resetPassword,
        updatePassword,
    };
};