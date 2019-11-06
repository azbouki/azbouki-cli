'use strict'

module.exports = function UserRepository(mysql) {

    function loginUser(email, pass){
        var query = [
            'SELECT id, email, password FROM user',
            'WHERE email=:email'
        ].join(" ");

        return mysql.makeQuery(query, {
            email: email,
            pass: pass,
        }, function(users){
            if (users.length === 0) {
                return false;
            }

            var loggedUser = null;
            var hash = '';
            users.forEach(function(user){
                if (bcrypt.compareSync(pass, user.password)) {
                    loggedUser = {
                        userId: user.id,
                        email: user.email,
                        loggedAt: new Date()
                    };
                    return false;
                }
            });
            return loggedUser;

        });
    }

    function checkIfUserExists(email, facebookId){
        var query = [
            'SELECT * FROM user',
            'WHERE email=:email'
        ].join(" ");

        return mysql.makeQuery(query, {
            email: email,
            facebookId: facebookId
        }, function (result) {
            return result && result.length > 0;
        });
    }

    function registerUser(userData){
        var query = [
            'INSERT INTO user (`email`, `password`)',
            'VALUES (:email, :password);'
        ].join(" ");

        // var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(userData.password);

        return mysql.makeQuery(query, {
            email: userData.email,
            password: hash
        }, function (result) {
            return {
                userId: result.insertId,
                email: userData.email,
            };
        });
    }

    function checkUserPassword(data){
        var query = [
            'SELECT password FROM user WHERE id = :userId'
        ].join(" ");

        return mysql.makeQuery(query, {
            userId: data.userId,
        }, function(user){
            if (user && user.length === 1) {
                return bcrypt.compareSync(data.oldPass, user[0].password);
            }
            else{
                return false;
            }
        });
    }

    function changePassword(data){
        var query = [
            'UPDATE user',
            'SET password = :newPass',
            'WHERE id = :userId'
        ].join(" ");

        return mysql.makeQuery(query, {
            userId: data.userId,
            newPass: bcrypt.hashSync(data.newPass)
        });
    }

    function findUser(userId){
        var query = [
            'SELECT * FROM user',
            'WHERE id=:userId'
        ].join(" ");

        return mysql.makeQuery(query, {
            userId: userId,
        }, function (user) {
            return user;
        });
    }

    function findUserByEmail(email){
        var query = [
            'SELECT * FROM user',
            'WHERE email=:email LIMIT 1'
        ].join(" ");

        return mysql.makeQuery(query, {email}, function (user) {
            return user.length && user.length > 0 ? user[0] : null;
        });
    }

    function findUserByToken(token) {
        var query = [
            'SELECT * FROM user',
            'WHERE reset_password_token = :token AND reset_token_expires > NOW()',
            'LIMIT 1'
        ].join(" ");

        return mysql.makeQuery(query, {
            token: token
        }, function (result) {
            return result.length > 0 ? result[0] : null;
        });
    }

    function updatePassword(email, password) {
        var query = [
            'UPDATE user',
            'SET password = :password',
            'WHERE email = :email'
        ].join(" ");

        const hash = bcrypt.hashSync(password);

        return mysql.makeQuery(query, {
            email: email,
            password: hash
        }, function (result) {
            return result.affectedRows > 0;
        });
    }

    function deleteToken(userId) {
        var query = [
            'UPDATE user',
            'SET reset_password_token = NULL',
            'WHERE id = :userId'
        ].join(" ");

        return mysql.makeQuery(query, {
            userId: userId
        }, function (result) {
            return result.affectedRows > 0;
        });
    }

    function updateResetToken(email, token) {
        let interval = '1 DAY';
        const query = [
            'UPDATE user',
            `SET reset_password_token = :token, reset_token_expires = DATE_ADD(NOW(), INTERVAL ${interval})`,
            'WHERE email = :email'
        ].join(" ");

        return mysql.makeQuery(query, {
            email: email,
            token: token
        }, function (result) {
            return result.affectedRows > 0;
        });
    }


    return {
        loginUser,
        checkIfUserExists,
        registerUser,
        checkUserPassword,
        changePassword,
        findUser,
        findUserByEmail,
        findUserByToken,
        updatePassword,
        deleteToken,
        updateResetToken,
    };
}