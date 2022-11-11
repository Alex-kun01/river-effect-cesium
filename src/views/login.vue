<!--  -->
<script  lang='ts'>
import { reactive, toRefs } from 'vue';
import { useMainStore } from '../store';
import { useUserStore } from '../store/user';
export default {
    name: 'login',
    setup() {
        const state = reactive({
            userName: '',
            passWordCode: '',
            code: ''
        });
        const baseStoreData = useMainStore();
        const userStoreData = useUserStore();
        const login = async() =>{
            const param = {
                account: state.userName,
                code: state.code,
                password: state.passWordCode,
                uuid: baseStoreData.captimage.uuid
            };
            const loginRes = await userStoreData.login(param);
            console.log(loginRes);
        };
        return {
            ...toRefs(state),
            baseStoreData,
            userStoreData,
            login
        };
    }
};
</script>
<template>
    <div class="login">
        <input type="text" v-model="userName">
        <input type="text" v-model="passWordCode">
        <input type="text" v-model="code">
        <img :src="baseStoreData.captimage.codeData" alt="">
        <button @click="login">登录</button>
        <div class="name">{{userStoreData.nickName}}</div>
        <div class="name">{{userStoreData.lastLoginTime}}</div>
        <div class="name">{{userStoreData.email}}</div>
    </div>
</template>
<style scoped  lang="scss">
button{
    cursor: pointer;
}
.name{
    color: white;
}
</style>

