const { chromium } = require('playwright');
const fetch = require('node-fetch');
const fs = require('fs');

let albImg, songName, ArtistInfo ,value = 0;
require('dotenv').config();

const {
    USERNAME: firstname,
    PASSWORD: password,

} = process.env;


//Playwright script to get bearer token which needs to be scraped in order to send get request to spotify's API
const playwrightScript = async () => {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://accounts.spotify.com/sv/login?continue=https:%2F%2Fwww.spotify.com%2Fse%2Faccount%2Foverview%2F');
    await page.fill('#login-username', `${firstname}`);
    await page.fill('#login-password', `${password}`);
    await page.click('#login-button');
    await page.goto('https://developer.spotify.com/console/get-users-currently-playing-track/?market=ES&additional_types=');
    await page.click('#fill-sample-data');
    await page.click('button:text("Get Token")');
    await page.click('#oauthRequestToken');
    await page.fill('#login-password', `${password}`);
    await page.press('#login-button', 'Enter');
//        await page.check('scope-user-read-currently-playing');
    await Promise.all([
        page.waitForSelector('#oauth-input')
    ])
    value = await page.$eval('#oauth-input', (el) => el.value);
    await browser.close();
    return value;
};
async function getToken()  {

    const newValue =  await playwrightScript();

    setTimeout(getToken, 3400000); //calls getToken first , then setstimeout of 1 hour for new token (Token expires after one hour )
    const headers1 = {
        'Authorization' : `Bearer ${newValue}`
    }
    return headers1;
}

async function getCurrentlyPLaying() {
    getToken().then((token) => {
        setInterval(async () => {
            fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                method: 'GET',
                headers: token //bearer token
            })
                .then(res => res.json())
                .then((json) => {
                    songName = json.item.name
                    albImg = json.item.album.images[2].url

                    ArtistInfo = ({
                        song: songName,
                        imag: albImg,
                    })
                    fs.writeFileSync("../../song.json", JSON.stringify(ArtistInfo)); //ArtistInfo will be stored in a song.json file
                    return JSON.stringify(ArtistInfo);
                })
                .catch((err) => console.log("error message: ", err))
        }, 5000); // Fetching is done with time intervall for 5 seconds (can be set to whichever you prefer)
    })
}

getCurrentlyPLaying();


/*

 //Adding this will export it as an API if you're builiding it for your NEXT.JS application.

export default async (req,res) => {
    res.status(200).json(process.cwd(), '../..song.json');
}
*/
