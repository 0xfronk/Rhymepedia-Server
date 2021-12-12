const axios = require("axios")
require("dotenv").config()
const token = process.env.TOKEN

const get_song = async (input) => {
    try{
        const results = await axios.get(`https://api.genius.com/search?q=${input}`, {
            headers: {
                Authorization : "Bearer " + token
            }
        })
        return (results.data.response.hits)
        
    }
    catch(err){
        return ({message: "Genius API (used to obtain lyrics) daily limit reached"})
    }
    
}

module.exports = get_song
