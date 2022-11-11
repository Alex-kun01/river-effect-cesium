/*
 * @Description:
 * @Version: 1.0
 * @Autor: yls
 * @Date: 2022-03-09 11:15:27
 * @LastEditors: yls
 * @LastEditTime: 2022-04-16 16:42:52
 */
export interface MenuState {
    title:string,
    twinXxv: any[],
    id: string,
    children?: any[],
    [propName:string]: any
}
export interface CaptimageState {
    codeData: string,
    uuid: string
}
