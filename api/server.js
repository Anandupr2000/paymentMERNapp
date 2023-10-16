let host = 'http://192.168.1.4'
let port = 3000

const connectToServer = async () => {
    try {
        const res = await fetch(host + ':' + port);
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
        const res = await fetch(host + ':' + port + '/users/register', {
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
        return err;
    }
}
const doLogin = async (phn, passcode) => {
    const postData = {
        phn: phn,
        pwd: passcode
    };
    try {
        const res = await fetch(host + ':' + port + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        return err;
    }
}

const searchUser = async (text) => {
    const postData = {
        keyword: text,
    };
    try {
        const res = await fetch(host + ':' + port + '/users/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        console.log(err)
        return err;
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
        const res = await fetch(host + ':' + port + '/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        // console.log(res);
        return res.json();
    }
    catch (err) {
        console.log(err)
        return err;
    }
}
export { connectToServer, doRegisteration, doLogin, doPayment, searchUser }