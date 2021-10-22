const bcrypt =  require('bcrypt');

const hashPassword = async(plainText)=>
{
   return bcrypt.hash(plainText, 10)
}

const comparePassword = async(plainText,hashText)=>
{
   return bcrypt.compare(plainText, hashText);
}

module.exports = {
    hashPassword,comparePassword
}