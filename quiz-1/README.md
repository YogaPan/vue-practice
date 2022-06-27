# Quiz 1 - Random User

[Live Demo](https://raven-vue-quiz-1.netlify.app/)

## 如何執行專案

環境：

1. 建議在 macOS 12 底下進行開發、運行。
2. [node](https://nodejs.org/en/) version 使用 16.15.0，可以使用 [nvm](https://github.com/nvm-sh/nvm) 進行 node 各版本安裝和切換。

本機開發步驟：

1. `cd ./quiz-2`: 進入 quiz-2 專案目錄。
2. `npm install`: 安裝 npm 套件、相關依賴。
3. 將 firebase admin credential 放在 `./quiz-2/firebaseAdminCredential.json` 路徑下後，執行 `npm run dummy-data`。若已經有資料可以跳過這部。
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
- 解法：在 Firebase 申請一組 Admin Credential（這組不能進到版控），接著透過透 Firebase Admin SDK 結合自己寫的腳本將資料寫入 Firebase 的 `users` Collection 中。

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

- 遇到的困難：這個 favorite 的資訊不能紀錄在 `users collection` 底下，理由是自己的收藏理應只有自己能看到，放在 `users collection` 底下會被其他使用者看到。
- 解法：另外開一個 `favorite` 的 collection，紀錄哪些 users 喜愛了其他哪些 users，而且必須進行權限控管，不能讓其他 users 看到自己的收藏。

### Firebase 問題五

Pagination 的實作有分為 offset-based pagination 和 cursor-based pagination

1. offset-based pagination => 適合傳統後台分頁的情境
2. cursor-based pagination => 適合 Infinite Scroll 的情境

問題：Firebase 只有支援 cursor-based pagination，無法實作一般後台的分頁。
解法：一次拉下所有 users 資料，透過前端進行分頁。但是效能較差，且很快就會 hit 到 firebase 的讀寫上限。目前沒有想到更好的解決方法或 Work Around。

另外關於程式架構的部分，因為個人時間壓力，以下幾點沒有實作：

1. 不合理非同步請求的預防，例如連續 Fetch 兩次，結果第一次 fetch response 有可能比第二次晚回來，導致看的結果不合預期。
2. 沒有針對每個 UI 元件的 Initial, Empty, Loading, Error, Success 等狀態進行全面的開發。
3. 沒有針對 firebase 的 query, update 再進行一層包裝，因為目前前後端邏輯都混再一起了。

## 如何部署專案

目前是透過 [Netlify](https://www.netlify.com/) 進行部署，當此 main branch 有新 commit、push 時便會自動觸發。
