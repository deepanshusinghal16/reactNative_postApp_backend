const bcrypt = require('bcrypt')

exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if (error)
                reject(error)
            bcrypt.hash(password, salt, (error, hashedPass) => {
                if (error)
                    reject(error)
                resolve(hashedPass);
            })
        })
    })
};

exports.comparePassword = (password,hashedPassword) => { 
    return bcrypt.compare(password, hashedPassword);
}
