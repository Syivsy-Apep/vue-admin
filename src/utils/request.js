import Vue from "vue";
import axios from 'axios';
import {Message} from 'element-ui'

//创建axios，赋值给service
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
const service = axios.create({
    baseURL:BASEURL,
    timeout:6000,
});


//添加请求拦截器
service.interceptors.request.use(function(config){
    //在发送请求之前做些什么
    return config;
},function(error){
    //对请求错误做些什么
    return Promise.reject(error)
});

//添加响应拦截
service.interceptors.response.use(function(response){
    let data = response.data;
    if(data.reCode != 0){
        Message.error(data.Message);
        return Promise.reject(data);
    }else{
        return response;
    }
},function(error){
    return Promise.reject(error)
})


export default service;

/**
 * 使用export default时，但不能同时存在多个default
 * 文件 import 不需要 {}
 */