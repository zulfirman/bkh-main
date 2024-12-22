const fs = require('fs');
const path = require('path');
const axios = require('axios');
const wrapper = require('axios-cookiejar-support').wrapper;
const cookieJar = require('tough-cookie').CookieJar;
const jar = new cookieJar();
const client = wrapper(axios.create({ jar }));
const qs = require('qs');
const schedule = require('node-schedule'); // Import node-schedule
require('dotenv').config()

// Hardcoded password
const PASSWORD = process.env.PASSWORD;  // Replace this with your desired hardcoded password

// Function to read emails from email.txt
function readEmails(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').map(email => email.trim()).filter(email => email);
    } catch (error) {
        console.error('Error reading emails:', error.message);
        return [];
    }
}

// Function to perform the signin request
async function performSignin(email) {
    let emailSplit = email.split(',,');
    email = emailSplit[0];

    const data = qs.stringify({
        email: email,
        password: PASSWORD
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://app.blockmesh.xyz/login',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'DNT': '1',
            'Origin': 'https://app.blockmesh.xyz',
            'Referer': 'https://app.blockmesh.xyz/login',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
            'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
        },
        data: data
    };
    console.log(data)

    let cookieFromSignin = '';
    try {
        // Send the request
        const response = await client.request(config);

        // Log the response data
        console.log(`Signin response:`, JSON.stringify(response.data).slice(-500));

        // Extract cookies from the jar
        jar.getCookies('https://app.blockmesh.xyz', (err, cookies) => {
            if (err) {
                console.error('Error getting cookies:', err);
                return;
            }
            console.log(cookies)
            const idCookie = cookies.find(cookie => cookie.key === 'id');
            if (idCookie) {
                cookieFromSignin = idCookie.value
            } else {
                console.log('id cookie not found');
            }
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
    }
    if (cookieFromSignin===''){
        return;
    }

    console.log('wait 2 seconds to get auth_status');
    await sleep(2000);
    config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://app.blockmesh.xyz/auth_status?perks_page=true',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': `id=${cookieFromSignin}`,
            'dnt': '1',
            'priority': 'u=1, i',
            'referer': 'https://app.blockmesh.xyz/ui/dashboard',
            'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
        }
    };
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error.response.data);
        });

    console.log('wait 2 seconds to post dashboard');
    await sleep(2000);
    config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://app.blockmesh.xyz/dashboard',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-length': '0',
            'cookie': `id=${cookieFromSignin}`,
            'dnt': '1',
            'origin': 'https://app.blockmesh.xyz',
            'priority': 'u=1, i',
            'referer': 'https://app.blockmesh.xyz/ui/dashboard',
            'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
        }
    };
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error.response.data);
        });


    console.log('wait 2 seconds to post daily_leaderboard');
    await sleep(2000);
    config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://app.blockmesh.xyz/daily_leaderboard',
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-length': '0',
            'cookie': `id=${cookieFromSignin}`,
            'dnt': '1',
            'origin': 'https://app.blockmesh.xyz',
            'priority': 'u=1, i',
            'referer': 'https://app.blockmesh.xyz/ui/dashboard',
            'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
        }
    };
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error.response.data);
        });
}

// Function to sleep for a specified number of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to handle signin tasks with delay
async function handleSigninWithDelay(email, delay) {
    await performSignin(email);
    console.log(`Sleeping for ${delay / 1000} seconds...`);
    await sleep(delay);  // Delay after each signin
}

// Schedule the signin task
const filePath = path.join(__dirname, 'email.txt');

async function scheduleSignin() {
    const emails = readEmails(filePath);

    if (emails.length > 0) {
        for (const email of emails) {
            console.log(`Running signin task for ${email}...`);
            const delayTime = Math.floor(Math.random() * (120000 - 90000 + 1)) + 90000;
            await handleSigninWithDelay(email, delayTime);  // 120000 ms = 2 minute
        }
    } else {
        console.error('No emails found in email.txt.');
    }
    console.log('Finished scheduled task.');
}

// Define the schedule for specific times in Asia/Jakarta timezone
const times = ['5 7 * * *', '1 9 * * *', '3 10 * * *', '7 12 * * *'];

// Schedule tasks for each specified time
for (const time of times) {
    schedule.scheduleJob({ rule: time, tz: 'Asia/Jakarta' }, scheduleSignin);
}

scheduleSignin()