var userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
module.exports = {
    check_authentication: async function (req, res, next) {
        if (!req.headers || !req.headers.authorization) {
            next(new Error("ban chua dang nhap")) ;
        } else {
            let authorizedtoken = req.headers.authorization;
            if (!authorizedtoken.startsWith("Bearer")) {
                next(new Error("ban chua dang nhap")) ;
            } else {
                let token = authorizedtoken.split(" ")[1];
                let result = jwt.verify(token, constants.SECRET_KEY);
                if (result.exp > Date.now()) {
                    let user = await userController.GetUserByID(result.id);
                    req.user = user;
                    next();
                } else {
                    next(new Error("ban chua dang nhap")) ;
                }
            }
        }
    },
    check_authorization:function(requiredRole){
        return function(req,res,next){
            let userRole= req.user.role.name;
            if(!requiredRole.includes(userRole)){
                next(new Error("ban khong co quyen")) ;
            }else{
                next()
            }
        }
    }
}