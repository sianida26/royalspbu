import axios from 'axios'
import DB from './DB'

const instance = axios.create({
    baseURL: '/api/',
    timeout: 20000,
})

const TIMEOUT_MESSAGE = "Ups. Permintaan ke server terputus. Coba lagi"

let db = new DB()
let token = ''

db.getAuthToken().then((result) => token = result?.value)

instance.interceptors.request.use(function(config) {
    //Do something before request is sent
    config.headers = {
        accept: 'application/json',
        Authorization: 'Bearer '+token
    }
    return config;
}, function (error){
    //Do something with request error
    if (error.code === "ECONNABORTED"){
        error.pesan = TIMEOUT_MESSAGE;
    } else {
        error.pesan = `Ups. Terjadi error. code: ${error.code}`;
    }
    return Promise.reject(error);
})

instance.interceptors.response.use(function(response){
    //Any status code that lie within the range of 2xx cause this function to trigger
    //Do something with response data
    return response;
}, function(error){
    //Any status codes that falls outside the range of 2xx cause this function to trigger
    //Do something with response error
    let pesan = "error"
        if (error.code === "ECONNABORTED"){ //Handle timeout error
            pesan = TIMEOUT_MESSAGE;
        } else if (error.code) { //Handle other request error
            pesan = `Ups. Terjadi error. code: ${error.code}`;
        } else { //handle response error
            let errorCode = error.response.status
            switch(errorCode){
                case 400 : pesan = "Terjadi error saat mengirim (400)"; break;
                case 401 : pesan = "Sesi login anda habis."; break;
                case 403 : pesan = "Anda tidak memiliki akses untuk ini"; break;
                case 404 : pesan = "URL / sesuatu yang dicari tidak ada"; break;
                case 405 : pesan = "Metode request ini tidak diizinkan";  break;
                case 408 : pesan = TIMEOUT_MESSAGE; break;
                case 409 : pesan = "Terjadi konflik. Mungkin data yang anda kirim sudah ada."; break;
                case 419 : pesan = "Token CSRF Anda hilang. silakan logout kemudian login kembali"; break;
                case 422 : pesan = "Ada data yang tidak sesuai. Silakan periksa kembali"; break;
                case 429 : pesan = "Anda terlalu banyak melakukan request ini"; break;
                case (Math.floor(errorCode/100) === 5): //server error
                    pesan =`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
                    break; 
                default: pesan = `Ups. terjadi error (${errorCode})`;
            }
        }
        error.pesan = pesan;
        return Promise.reject(error);
})

export default instance

//default template
// axios({method:'get', url: '/getUserDetail'})
// .then(result => { //handle success response
//     let data = result.data;
// })
// .catch(error =>{ //handle error response
//     let errorMessage = error.pesan ? error.pesan : "Terjadi kesalahan pada pengaturan request ini. Silakan hubungi Admin.";
//     if (error.request){
//         //Request was made but no response was received
//     } else if (error.response){
//         //Error caused from the server
//         let errorCode = error.response.status
//         switch(errorCode){
//             case 400: /*bad request*/ break; 
//             case 401: /*Unauthorized*/ break;
//             case 403: /*Forbidden*/ break;
//             case 404: /*not found*/ break; 
//             case 405: /*method not allowed*/ break; 
//             case 408: /*Request timed out*/ break;
//             case 409: /*Conflict*/ break;
//             case 419: /*Page expired, CSRF token missing*/ break;
//             case 422: /*Validation failed*/ break;
//             case 429: /*Too Many Request */ break;
//             case (Math.floor(errorCode/100) === 5): //server error
//                 errorMessage=`Ups. Terjadi error di dalam server. silakan coba lagi nanti (${errorCode})`;
//                 break; 
//             default: /* Other errors */
//                 errorMessage=`Ups. terjadi error (${errorCode})`;
//         }
//     } else {
//         //Something happened in setting up the request that triggered an Error
//     }
//     //you can show error notification here
//     enqueueSnackbar(errorMessage,{variant:"error"});
// });