# Quiz 1 - Random User

[Live Demo](https://raven-vue-quiz-1.netlify.app/)

## 如何執行專案

環境：

1. 建議在 macOS 12 底下進行開發、運行。
2. [node](https://nodejs.org/en/) version 使用 16.15.0，可以使用 [nvm](https://github.com/nvm-sh/nvm) 進行 node 各版本安裝和切換。

本機開發步驟：

1. `cd ./quiz-2`: 進入 quiz-2 專案目錄。
2. `npm install`: 安裝 npm 套件、相關依賴。
3. 將 firebase admin credential 放在 `./quiz-2/firebaseAdminCredential.json` 路徑下後，執行 `npm run dummy-data`。若已經有資料可以跳過這步。
4. `npm run dev`: 使用 vite HMR 進型本機開發。
5. 在瀏覽器開啟 [localhost:3000/](http://localhost:3000/)，即可進行預覽、開發。

## 遇到的困難、問題，以及解決的方法

### 規格部分

自己對於 quiz-1 題目的理解有誤區 => 解法：透過郵件溝通，並且將情境列出進行討論。經討論出具體情境如下：

1. 原始有 3010 筆資料，為 Random User Generator API 產生的資料，並且儲存在 Firebase。
2. 接著有使用者 「Raven」註冊，此時 Users 總數增加，為 3010 + 1 = 3011 筆。
3. 使用者 Raven 登入後進入首頁，可以看到「除了自己」以外的 3010 筆資料。
4. 接著有使用者「Isaac」註冊，此時 Users 總數增加，為 3011 + 1 = 3012 筆。
5. 使用者 Isaac 登入後進入首頁，可以看到「除了自己」以外的 3011 筆資料（看得到上一個註冊者 Raven）。

接下來全部都是在串接 Firebase 資料庫遇到的問題。

### Firebase 問題一

- 遇到的困難：如何塞 3010 筆的 Dummy Data 到 Firebase？
- 解法：在 Firebase 申請一組 Admin Credential（這組不能進到版控），接著透過透 Firebase Admin SDK 結合自己寫的腳本將資料寫入 Firebase 的 `users` Collection 中，且 Firestore 一次請求最多允許寫入 500 筆資料，需要分批 batch 處理。

### Firebase 問題二

- 遇到的困難：對於 Firebase 的登入認證方式不熟悉。
- 解法：透過 Firebase  的 `onAuthStateChanged` 和 Vue Router 的 `beforeEnter`  配合，進行登入權限控管。除此以外還需要針對 `Cloud Firestore Rules`  進行調整，避免未登入的使用者存取到資料。

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if
        request.auth != null
    }
  }
}
```

### Firebase 問題三

- 遇到的困難：Firebase 的 `Authentication Users` 資料的權限控管和顯示在首頁的  `users collection` 資料儲存是分開的。導致資料分散在兩處。
- 解法：在「註冊」新 Users 時，除了 `createUserWithEmailAndPassword` 以外，還需要對 `users collection`  進行新增，將剛剛註冊的 User 的 name, email 寫入。

### Firebase 問題四

Pagination 的實作有分為 offset-based pagination 和 cursor-based pagination

1. offset-based pagination => 適合傳統後台分頁的情境
2. cursor-based pagination => 適合 Infinite Scroll 的情境

問題：Firebase 只有支援 cursor-based pagination，難以實作一般後台的分頁。
解法：

1. 因為 firestore 沒 total count，這裡使用 [distributed counter](https://firebase.google.com/docs/firestore/solutions/counters)，作為計算分頁數量用。
2. 跳至下一頁使用 `startAfter 最後一筆資料` 進行查詢。
3. 跳至上一頁使用 `startAfter 第一筆資料` 進行「反方向排序」查詢。
4. 跳至最後一頁的實作方法為使用「反方向的排序」來撈資料，這樣就能夠抓到最後一頁的資料。

## 如何部署專案

目前是透過 [Netlify](https://www.netlify.com/) 進行部署，當此 main branch 有新 commit、push 時便會自動觸發。
