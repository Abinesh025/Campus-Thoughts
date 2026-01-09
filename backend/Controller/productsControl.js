export const getProducts = async(req,res)=>{
    try
    {
        return res.status(200).json({success :true ,message:"Products get Succesfully"});
    }
    catch(error)
    {
        return res.status(400).json({error:`${error.message}`});
    }
}