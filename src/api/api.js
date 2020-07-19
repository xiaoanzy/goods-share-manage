import axios from 'axios'


const url = '';

//axios.defaults.headers.common["token"]
/**
 * 用户登录
 * @param {*} userName 
 * @param {*} userPassword 
 */
export const doLogin = function (userName, userPassword) {
    return axios.get(url + '/api/user/doLogin', {
        params: {
            userName: userName,
            userPassword: userPassword
        }
    });
}

/**
 * 获取用户信息
 * @param {*} token 
 */
export const getUserInfo = function (token) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/user/getUserInfo');
}

//////////////////////////////////////////////////////////


export const insertGoodsInfo = function (token) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/insertGoodsInfo');
}

export const checkGoodsInfo = function (token) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/checkGoodsInfo');
}
export const clearRepeatGoods = function (token) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/clearRepeatGoods');
}

export const getProblemGoodsList = function (token, index, size) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/getProblemGoodsList', {
        params: {
            index: index,
            size: size
        }
    });
}

export const modifyProblemGoodsState = function (token, id, state) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/modifyProblemGoodsState', {
        params: {
            id: id,
            state: state
        }
    });
}

export const getDbCount = function (token) {
    axios.defaults.headers.common["token"] = token;
    return axios.get(url + '/api/admin/findCount');
}
