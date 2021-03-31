const express = require('express')
const path = require('path')
const moment = require('moment')
const {HOST, IMG} = require('./src/constants')
const db = require('./src/database')

const PORT = process.env.PORT || 5000

const app = express()
    .set('port', PORT)
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

// Static public files
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.send('Get ready for OpenSea!');
})
app.get('/', function (req, res) {
    res.send({
        "name": "CyberKitties",
        "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
        "image": "https://openseacreatures.io/image.png",
        "external_link": "https://openseacreatures.io",
        "seller_fee_basis_points": 1000,
        "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721"
    })
})

app.get('/api/token/:token_id', function (req, res) {
    const tokenId = parseInt(req.params.token_id).toString()
    const person = db[tokenId]
    const bdayParts = person.birthday.split(' ')
    const day = parseInt(bdayParts[1])
    const month = parseInt(bdayParts[0])
    const data = {
        'name': person.name,
        'attributes': {
            'birthday': person.birthday,
            'birth month': monthName(month),
            'zodiac sign': zodiac(day, month),
            // 'age': moment().diff(person.birthday, 'years')
        },
        'image': `${IMG}/${tokenId}.png`
    }
    res.send(data)
})

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
})

// returns the zodiac sign according to day and month ( https://coursesweb.net/javascript/zodiac-signs_cs )
function zodiac(day, month) {
    var zodiac = ['', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
    var last_day = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
    return (day > last_day[month]) ? zodiac[month * 1 + 1] : zodiac[month];
}

function monthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    return monthNames[month - 1]
}
