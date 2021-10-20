const bcrypt =  require('bcrypt');

const hashPassword = async(plainText)=>
{
   return bcrypt.hash(plainText, 10)
}

module.exports = {
    hashPassword
}