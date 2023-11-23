// let host = 'http://192.168.1.4'
// let port = 3000
// let host = "https://sangria-wasp-gear.cyclic.app"
let host = "https://paymentappserver.onrender.com"

const connectToServer = async () => {
    try {
        // const res = await fetch(host + ':' + port);
        const res = await fetch(host);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.text();
    } catch (err) {
        return err;
    }
}
const doRegisteration = async (name, email, phn, passcode) => {
    const postData = {
        name: name,
        email: email,
        phn: phn,
        pwd: passcode
    };
    try {
        // const res = await fetch(host + ':' + port + '/users/register', {
        const res = await fetch(host + '/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }
    catch (err) {
        return { err: err, success: false }
    }
}
const doLogin = async (phn, passcode) => {
    const postData = {
        phn: phn,
        pwd: passcode
    };
    try {
        // const res = await fetch(host + ':' + port + '/users/login', {
        const res = await fetch(host + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            // throw new Error('Network response was not ok');
            throw new Error('Unable to connect to server');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        return { err: err, success: false }
    }
}

const searchUser = async (text) => {
    const postData = {
        keyword: text,
    };
    try {
        const res = await fetch(host + '/users/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Unable to connect to server');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        console.log(err)
        return { err: err, success: false }
    }
}
/**
 * 
 * @param {*} payor phone number of payor
 * @param {*} payee phone number of payee
 * @param {*} amount payment to be done
 * @returns 
 */
const doPayment = async (payor, payee, amount) => {
    const postData = {
        payorPhn: payor,
        payeePhn: payee,
        amount: amount,
    };
    console.log(postData)
    try {
        const res = await fetch(host + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Unable to connect to server');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        console.log(err)
        return { err: err, success: false }
    }
}
export { connectToServer, doRegisteration, doLogin, doPayment, searchUser }