import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 方法get封装
export function get(url: string, params = {}): Promise<AxiosResponse<AjaxResult>> {
    return new Promise<AxiosResponse<AjaxResult>>((resolve, reject) => {
        axios
            .get(url, { params })
            .then((res) => {
                resolve(res);
            })
            .catch((err: unknown) => {
                reject(err);
            });
    });
}
// 方法post封装
export function post(url: string, data?: {[s:string]: unknown} | null, option?: AxiosRequestConfig): Promise<AxiosResponse<AjaxResult>> {
    return new Promise<AxiosResponse<AjaxResult>>((resolve, reject) => {
        axios.post(url, data, option).then((res) => {
            resolve(res);
        },
        (err: unknown) => {
            reject(err);
        });
    });
}
// 方法patch封装
export function patch(url: string, data = {}): Promise<AxiosResponse<AjaxResult>> {
    return new Promise<AxiosResponse<AjaxResult>>((resolve, reject) => {
        axios.patch(url, data).then((res) => {
            resolve(res);
        },
        (err: unknown) => {
            reject(err);
        });
    });
}
// 方法put封装
export function put(url: string, data = {}): Promise<AxiosResponse<AjaxResult>> {
    return new Promise<AxiosResponse<AjaxResult>>((resolve, reject) => {
        axios.put(url, data).then((res) => {
            resolve(res);
        },
        (err: unknown) => {
            reject(err);
        });
    });
}
