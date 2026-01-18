# huava-vue3

[huava](https://github.com/Camio1945/huava) 项目对应的前端代码。是基于 [LikeAdmin](https://github.com/likeshop-github/likeadmin_php/tree/master/admin) 改写的。

The fronted of [huava](https://github.com/Camio1945/huava). Based on [LikeAdmin](https://github.com/likeshop-github/likeadmin_php/tree/master/admin).

---
# Install And Run
```shell
npm install -g pnpm
pnpm install
pnpm run dev
```

---

# Develop note

1. `src/config/index.ts` defines default request prefix, the original value is `adminapi`, I changed it to empty string ""

2. `src/utils/request/index.ts` set the AxiosHooks, such as adding token to the header, intercept request and response.

3. `.env.development` set the backend api address, such as `VITE_APP_BASE_URL='http://localhost:22345'`

