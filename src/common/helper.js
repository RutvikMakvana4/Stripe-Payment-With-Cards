

/**
 * @description : generate random string for given length
 * @param {number} length : length of random string to be generated (default 75)
 * @return {number} : generated random string
 */

export const randomStringGenerator = (givenLength = 75) => {
    const characters =
        givenLength > 10 ?
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" :
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = givenLength;
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomStrGen = Math.floor(Math.random() * characters.length);
        randomString += characters[randomStrGen];
    }
    return randomString
}




/**
 * @description : generate random number for given length
 * @param {number} length : length of random number to be generated (default 75)
 * @return {number} : generated random number
 */
export const randomNumberGenerator = (givenLength = 5) => {
    const characters = "123456789";
    const length = givenLength;
    let randomNumber = "";

    for (let i = 0; i < length; i++) {
        const randomNumGen = Math.floor(Math.random() * characters.length);
        randomNumber += characters[randomNumGen];
    }
    return randomNumber
}

