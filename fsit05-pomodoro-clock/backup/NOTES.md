# 蕃茄鐘網頁計時器實作_NOTES
    - 參考網頁: https://tomato-timer.com/  
                https://www.playpcesor.com/2015/01/pomodoro-time-manager-top-10-app.html
                https://zh.wikipedia.org/wiki/%E7%95%AA%E8%8C%84%E5%B7%A5%E4%BD%9C%E6%B3%95
    - 基本目標: 
        製作出一個網頁版的番茄鐘計時器, 工作與休息時間, 時間到會彈出視窗與鈴聲提醒使用者, 每四循環休息15~30分鐘.
        計時過程會有動畫顯示.(例如時間轉盤, 時針走動之類的...)
    - 進階目標: 
        追加功能讓使用者可以調整彈出訊息?/設定工作目標/儲存時間紀錄/自選鈴聲...
        
# 架構流程
    - 使用者進入網頁後, 選擇工作時間與休息時間,點選開始功能開始倒數計時
    - 時間到後跳出視窗通知, 使用者點選後進入休息時間倒數計時.
    - 休息時間結束後, 跳出視窗恭喜使用者完成工作, 同時詢問是否要繼續下一個工作.
    - 如要繼續下一個工作就自動開始倒數計時, 取消則回到原始畫面,時間自動reset.
    


# 設計框架選擇-->使用jQuery Mobile/Bootstrap???
        
# 運用技術
    - HTML5&CSS3
    - Bootstrap 4
    - jQuery
    - JavaScript
    
# 簡易版_設計步驟(記得每做一段就測試) [程式先做完再修版面!]
    1. 先建立一個HTML文件, 包含基本標題、時間文字、開始/重製/暫停按鈕
    2. 建立計時程式(先做出會自動計時的程式), 如何在網頁上呈現.
    3. 程式可行後再套用click事件,加入使用者操作.
    4. 加入使用者自訂時間、調整通知鈴聲
    5. 調整網頁版型&畫面美化.
    6. 簡易版完成
    
# 進階版_設計步驟 (增加動畫、使用者增加每段計時的文字敘述、幫使用者紀錄一個log、)


# 過程中遇到的問題紀錄

    1. 使用setInterval還是setTimeout?
    2. 倒數的計算公式?
    3. 是否將程式分區以函式封裝? 如何封裝?
    4. 函式參數的傳入傳出應用 (觀念不熟?)
    5. 點選工作時間/長短休息時間時, 自動跳出正確時間?
    6. 倒數進行時, 如果按下開始, 數字會加速亂跳, 如何解決?
        ->讓倒數期間開始按鈕不能點選, 但是按暫停之後再按開始又要能繼續...
        -->用jquery的 bind() & unbind() 方法解決了!
    7. 桌面通知功能 Notifications_API
        (https://davidwalsh.name/notifications-api  https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
    8. 鈴聲功能在手機端無法執行Orz (用click事件卻可以)
    9. 如果把自訂時間的數值儲存在local storage可以嗎? (這樣使用者下次使用就可以了? // 
        做個偽登入系統? 帳號密碼存在local storage? 用mysql放在cloud9?)
    10. 在視窗標題隨時間倒數跳秒數(成功), 但是如果計時結束要換回來正常標題好像換不回來?
    11. // 用除法的方法 被除數會是總秒數, 除數是60秒, 商數就會是分, 餘數就會是秒.
        
        // 20180814AM 
        // 初始化的時候就先把資料(time/mode/sound/autostart/...)存到localstorage
        // 程式執行是以localstorage的資料為主
        // 使用者自訂設定儲存-->Localstorage
        // 回復預設設定-->reset local storage(呼叫初始化的function)
        // 追加: 每四次完整工作時間+短休息時間=>1次長休息
        
        //  BUG 要解決
        //  1. 聲音音量自訂後未改變 OK
        //  2. 每四次一次長休息 OK
        //  3. 畫面要不要再美化 OK 追加背景輪播 