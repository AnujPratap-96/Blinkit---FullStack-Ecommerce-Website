import axios from "axios";
import SummaryApi , { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

//sending access token in the header
Axios.interceptors.request.use(
    async(config)=>{
        const access_token = localStorage.getItem('access_token')

        if(access_token){
            config.headers.Authorization = `Bearer ${access_token}`
        }

        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

//extend the life span of access token with 
// the help refresh
Axios.interceptors.request.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config 

        if(error.response.status === 401 && !originRequest.retry){
            originRequest.retry = true

            const refresh_token = localStorage.getItem("refresh_token")

            if(refresh_token){
                const newAccessToken = await refreshAccessToken(refresh_token)

                if(newAccessToken){
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }
        
        return Promise.reject(error)
    }
)


const refreshAccessToken = async(refresh_token)=>{
    try {
        const response = await Axios({
            ...SummaryApi.refresh_token,
            headers : {
                Authorization : `Bearer ${refresh_token}`
            }
        })

        const access_token = response.data.data.access_token
        localStorage.setItem('access_token',access_token)
        return access_token
    } catch (error) {
        console.log(error)
    }
}

export default Axios