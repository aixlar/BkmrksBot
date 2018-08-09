const axios             = require('axios')

const postBookmark      =   ({tag, URL, title}) => {
    const addURL        =   'https://getpocket.com/v3/add'
    const data          =   JSON.stringify({
        'url'           :   URL,
        'title'         :   title,
        'tags'          :   tag,
        'consumer_key'  :   process.env.CONSUMER_KEY,
        'access_token'  :   process.env.ACCESS_TOKEN,
    })
    const options       =   {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    axios.post(addURL, data, options)
        .then(  response  =>  console.log(response))
        .catch( error     =>  console.log(error))
}

module.exports = postBookmark
