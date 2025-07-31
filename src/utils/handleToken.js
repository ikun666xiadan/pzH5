const setToken = (res) => {
    localStorage.setItem("h5_token", res.data.token);
    localStorage.setItem("h5_userInfo", JSON.stringify(res.data.userInfo));
}

const removeToken = () => {
    localStorage.removeItem('h5_token')
    localStorage.removeItem('h5_userInfo')
}

export { setToken, removeToken }