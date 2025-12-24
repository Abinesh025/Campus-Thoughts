import jsonToken from "jsonwebtoken"
export const getToken = async(userID,res)=>{
    try
    {
        const tokens  =jsonToken.sign({userID},process.env.KEY,{
            expiresIn:"15D"
        })

        res.cookie("jwt",tokens,{
            maxAge:15*24*60*1000,
            httpOnly:true,
            SameSystem:true
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"});
    }
}