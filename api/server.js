// let host = 'http://192.168.1.4'
// let port = 3000
// let host = "https://sangria-wasp-gear.cyclic.app"

import { useSelector } from "react-redux";
import { selectUserPhn } from "../store/features/user/userSlice";

// let host = "https://paymentappserver.onrender.com"
let host = "http://192.168.1.6:3000"

const connectToServer = async (customTimeout) => {
    try {
        // const res = await fetch(host + ':' + port);
        let res;
        if (customTimeout) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), customTimeout);

            res = await fetch(host, { signal: controller.signal })
                .catch(err => {
                    if (err.name == 'AbortError')
                        throw new Error('Unable to connect to server');
                });
            clearTimeout(id);
        }
        else
            res = await fetch(host);
        // console.log(res);
        if (res.name == 'AbortError') {
            throw new Error('Unable to connect to server');
        }
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return await res.text();
    } catch (err) {
        console.log(err.name);
        console.log(err.message);
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
const updateUser = async (updatePhn, data) => {
    const postData = {
        id: updatePhn,
        data: data
    }
    console.log(postData);
    // return
    let res = await fetch(host + '/users/update', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
    // .then(res => {
    //     // res = r
    //     // console.log(r);
    //     return res.json()
    // })
    return res.json()
}
const searchUser = async (text, phn) => {
    const postData = {
        keyword: text,
        currentUserPhn: phn
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
    // console.log(postData)
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

const generateOTP = async ({ type, value }) => {
    try {
        console.log(JSON.stringify({ type, value }));
        const res = await fetch(host + '/users/sendOtp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, value }),
        });
        if (!res.ok) {
            throw new Error('Unable to connect to server');
        }
        // console.log(host + '/users/sendOtp');
        return res.json();
    }
    catch (err) {
        console.log(err)
        return { err: err, success: false }
    }
}
const verifyOTP = async ({ otp, value }) => {
    try {
        const res = await fetch(host + '/users/verifyOtp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp, value }), // passes otp and value which may be email or phn which receives otp
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

const getTransactions = async (userPhn) => {
    const res = await fetch(host + '/payment/getAllTransactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phn: userPhn }),
    })
    return res.json().then(res => res.transactions).catch(err => ({ success: false, err: 'No transaction data found' }))
}
const syncUserData = async (phn) => {
    const postData = {
        phn: phn,
    };
    try {
        // const res = await fetch(host + ':' + port + '/users/login', {
        const res = await fetch(host + '/users/fetch', {
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
export { connectToServer, doRegisteration, doLogin, doPayment, updateUser, searchUser, generateOTP, verifyOTP, getTransactions, syncUserData }