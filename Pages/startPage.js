const fs = require('fs');
const { google } = require('googleapis');
const base64url = require('base64url');
const TOKEN_PATH = 'token.json';
const config = require('../Config/config');
const messagesArr = [];
let countOfMessages = 0;
let logger = config.logger;

async function authorize(search) {
    let content = JSON.parse(fs.readFileSync('credentials.json'));
    const { client_secret, client_id, redirect_uris } = content.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    let token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    logger.trace('Authorize is successful.')
    await getMessages(oAuth2Client, search);
}
/**
 * @param {google.auth.OAuth2} auth
 */
async function getMessages(auth, search) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.messages.list({
        userId: 'me',
    }, function (err, res) {
        if (err) logger.error('The API returned an error: ' + err);
        logger.trace(res.data.messages);
        res.data.messages.forEach(function (object) {
            //logger.trace(object.id);
            gmail.users.messages.get({
                'userId': 'me',
                'id': object.id
            }, function (err, res) {
                if (err) logger.error('The API returned an error: ' + err);
                //logger.trace(res.data.payload.headers);
                res.data.payload.headers.forEach(function (header) {
                    logger.trace(header)
                    if (header.name === 'Subject' && header.value.includes(search)) {
                        logger.trace(res.data.payload.body.data)
                        countOfMessages++;
                        logger.trace(`Count of messages ${countOfMessages}`);
                        messagesArr.push(base64url.decode(res.data.payload.body.data));
                        //logger.trace(base64url.decode(res.data.payload.body.data));
                    }
                })
            })
        })
    });
}

async function getCountOfMessages() {
    logger.trace(`Return getCountOfMessages(): ${countOfMessages}`);
    return countOfMessages;
}

function getSubject(message) {
    let subject = message.match(/Subject:.+/)[0].replace('Subject: ', '');
    logger.trace(`Return getSubject(message): ${subject}`);
    return subject;
}

function getDeadline(message) {
    let deadline = message.match(/[а-я]+,.[\d]+.[а-я]+,.[\d]{2}:[\d]{2}/)[0];
    logger.trace(`Return getDeadline(message): ${deadline}`);
    return deadline;
}

async function getBody() {
    messagesArr.forEach(function (message) {
        messages = `Задание: ${getSubject(message)}. Срок выполнения: ${getDeadline(message)}\nТело письма:\n${message}`;
        logger.info(messages);
    });
}

module.exports = {
    authorize: authorize,
    getBody: getBody,
    getCountOfMessages: getCountOfMessages
}
