import jwt from "jsonwebtoken"

const  generateTokenSetCookie = (userId, res) =>{
    const SECRET = 'your secret';

    const token = jwt.sign({userId}, SECRET,{
        expiresIn: '30d',
    })
    res.cookie("jwt",token,{
        maxAge: 30 * 24 * 60 * 60 * 1000, //miliseconds
        httpOnly: true, // prevent xss attacks
        sameSite:"strict",// Prevent from CSRF 
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}

export default generateTokenSetCookie;