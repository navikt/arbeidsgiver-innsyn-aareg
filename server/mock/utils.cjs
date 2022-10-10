const delay = ms => new Promise(r => setTimeout(r, ms));

const randomInt = (max) => Math.floor(Math.random() * Math.floor(max));

module.exports = {
    delay,
    randomInt
}