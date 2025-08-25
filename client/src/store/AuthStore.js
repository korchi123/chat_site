import {makeAutoObservable} from 'mobx'

import { $host,$authHost } from '../http';

export default class AuthStore {
    constructor(){
        this._isAuth = false;
        this._user = {};
        makeAutoObservable(this, {}, { autoBind: true });
        
        // Автоматическая проверка при создании
        
    }

    set isAuth(isAuth){
        this._isAuth=isAuth;
    }
    set user(user){
        this._user=user;
    }
    get isAuth(){
        return this._isAuth
    }
    get user(){
        return this._user
    }
    async registration(email, password, nickname) {
    try {
        const response = await $host.post(`/user/registration`, { 
            email, password, nickname 
        });
        console.log('Registration response:', response.data);
        
        
            localStorage.setItem('accessToken', response.data.accessToken);
            this.isAuth = true;
            this.user = response.data.user;
        
        
        return response;
    } catch (e) {
        console.log('Registration error:', e.response?.data);
        throw e;
    }
    }
    async resendActivationLink() {
    try {
        if (!this.user?.email) {
            throw new Error('Email пользователя не найден');
        }
        const response = await $host.post('/user/resendactivation', { 
            email: this.user.email 
        });
        return response;
    } catch (e) {
        console.error('Ошибка при повторной отправке письма:', e);
        throw e;
    }
}
    async login(email, password) {
        try {
            const response = await $host.post(`/user/login`, { email, password });
            
                localStorage.setItem('accessToken', response.data.accessToken);
                this.isAuth=true;
                this.user = response.data.user;
            
            
            return response;
        } catch (e) {
            console.log('НЕ УДАЛОСЬ ВОЙТИ',e.response?.data?.message);
            throw e;
        }
    }

    async logout() {
        const response = await $authHost.post('/user/logout', null);
        
        
            localStorage.removeItem('accessToken');
            this.isAuth = false;
            this.user = {};
        
        
        return response;
    }
    async checkAuth (){
        try {
            const response = await $host.get('/user/refresh');
            localStorage.setItem('accessToken', response.data.accessToken);
            this.isAuth = true;
            this.user = response.data.user;
            return response;
        } catch (e) {
            console.log('Ошибка проверки авторизации:', e);
            localStorage.removeItem('token');
            this.isAuth = false;
            this.user = {};
            throw e;
        }

    }
    async deleteRequest(email) {
    return $authHost.post('/user/delete/request', { email });
}
async deleteConfirm(code) {  // Принимаем код подтверждения
    try {
        const response = await $authHost.post('/user/delete/confirm', { code });
        localStorage.removeItem('accessToken');
        this.isAuth = false;
        this.user = {};
        return response;
    } catch (e) {
        console.log('Delete confirm error:', e);
        throw e;
    }
}
    
}