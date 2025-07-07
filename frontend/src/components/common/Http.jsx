export const apiUrl = "http://localhost:8000/api";

export const adminToken = () => {
    const data = localStorage.getItem('adminInfo')
    const adminToken = JSON.parse(data)
    return adminToken.token
}

export const userToken = () => {
    const data = localStorage.getItem('userInfo')
    const userToken = JSON.parse(data)
    return userToken.token
}