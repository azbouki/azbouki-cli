var url = require('url')
var mysql = require('../lib/mysqlConnection/MysqlConnection'),
    config = require('../config'),
    UserRepository = new (require('./UserRepository'))(mysql, config);
var jwt = require('jwt-simple');
var app = require('../app');
/* TODO: Remove these and use Claims*/
const ROLES_ADMIN = 1;
const ROLES_USER = 2;

/* End TODO */

module.exports = function JWTAuth() {

    function checkUser(adminAccess, req, res, next) {
        var parsed_url = url.parse(req.url, true)

        var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];

        if (token) {

            try {
                var decoded = jwt.decode(token, app.get('jwtTokenSecret'))

                UserRepository.findUser(decoded.iss).then(function (users) {

                    if (users.length === 0) {
                        res.status(500).json({
                            success: false,
                            msg: "User not found"
                        });
                    }
                    let user = users[0];
                    if (adminAccess) {
                        if ([ROLES_ADMIN, ROLES_USER].indexOf(user.role) === -1) { // TODO: Remove these and use Claims
                            req.user = user;
                            res.status(500).json({
                                success: false,
                                msg: "Admins only can access this page."
                            });
                        } else {
                            req.user = user;
                            return next();
                        }
                    } else {
                        req.user = user;
                        return next();
                    }


                }).catch(function (err) {
                    catchError(res, err);
                });

            } catch (err) {
                res.status(500).json({
                    success: false,
                    msg: 'No token provided'
                });
            }

        } else {
            catchError(res, "No token provided");
        }
    }

    function adminCheck(req, res, next) {
        checkUser(true, req, res, next);
    }

    function regularCheck(req, res, next) {
        checkUser(false, req, res, next);
    }

    return {
        adminCheck: adminCheck,
        regularCheck: regularCheck
    }
}
