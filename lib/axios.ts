import axios from 'axios';


const api = axios.create({
baseURL: 'https://learn.smktelkom-mlg.sch.id/kos/api',
timeout: 10000,
headers: {
'Content-Type': 'application/json',
// Header global default (boleh diletakkan di sini atau saat request individual)
'MakerID': '1',
},
});


// Interceptor request: bisa menambahkan token otomatis dari localStorage
api.interceptors.request.use((config) => {
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
if (token && config.headers) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
}, (error) => Promise.reject(error));


// Interceptor response: tangani error global, refresh token, dsb.
api.interceptors.response.use((res) => res, (error) => {
// Contoh: jika unauthorized, hapus token
if (error?.response?.status === 401) {
if (typeof window !== 'undefined') localStorage.removeItem('token');
}
return Promise.reject(error);
});


export default api;