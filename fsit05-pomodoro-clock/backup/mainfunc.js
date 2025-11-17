/*Created by Daniel Huang 2018
    Pomodoro Clock
    Bug Report: https://ppt.cc/fITn4x
*/

$(document).ready(function() {
            
            //--------------------------------背景畫面輪播---------------------------------
            
            // 背景畫面輪播 API
            // https://github.com/jquery-backstretch/jquery-backstretch
            
            $.backstretch([
                './background/taipei.jpg',
                './background/taiwan-mountain.jpeg',
                './background/tomato-bk.jpg',
            ], {
                fade: 1000, // 淡入淡出
                duration: 15000 // 每幾秒切換
            });
            
            //--------------------------------初始化/使用者自訂---------------------------------
            function constructor() {
                window.localStorage.clear();                
                
                // 時間
                window.localStorage.setItem("work","1500");
                window.localStorage.setItem("shortB","300");
                window.localStorage.setItem("longB","600");
                
                // 其他設定
                window.localStorage.setItem("showTitle","true");
                window.localStorage.setItem("autoContinue", "true");
                
                //window.localStorage.setItem("cycle", "0");
                
                window.localStorage.setItem("volume", "0.5");
                window.localStorage.setItem("audioS", "Dewey");
                window.localStorage.setItem("audioL", "Cartoon");
                window.localStorage.setItem("audioW", "Baila");
                
                // 顯示的時間
                $("#showTime").text("25:00");
                
                // checkbox
                $("#titleSwitch").prop("checked", true);
                $("#autoSwitch").prop("checked", true);
            }
            
            // 初始化
            constructor();
            
            function setCustom() {
                window.localStorage.clear();
                
                var setWork = $("#userWork").val();
                var setShort = $("#userShort").val();
                var setLong = $("#userLong").val();
                
                // var setTitle = $("#titleSwitch").val();
                // var autoCon = $("#autoSwitch").val();
                
                var setVolume = $("#setVolume").val();
                var audioS = $("#audioSelShort").val();
                var audioL = $("#audioSelLong").val();
                var audioW = $("#audioSelWork").val();

                // 判斷使用者輸入的時間是否正確
                if (setWork <= 60 && setWork > 0) {
                    setWork = setWork*60;
                } else {
                    setWork = 1500;
                    $("#userWork").prop("value","25");
                }
                
                if (setShort <= 60 && setShort > 0) {
                    setShort = setShort*60;
                } else {
                    setShort = 300;
                    $("#userShort").prop("value","5");
                }
                
                if (setLong <= 60 && setLong > 0) {
                    setLong = setLong*60;
                } else {
                    setLong = 600;
                    $("#userLong").prop("value","10");
                }
                
                window.localStorage.setItem("work", setWork);
                window.localStorage.setItem("shortB",setShort);
                window.localStorage.setItem("longB", setLong);
                
                if ($("#autoSwitch").prop("checked") == true) {
                    window.localStorage.setItem("autoContinue", "true");
                    $("#autoSwitch").prop("checked", true);
                } else {
                    window.localStorage.setItem("autoContinue", "false");
                    $("#autoSwitch").prop("checked", false);
                }
                
                if ($("#titleSwitch").prop("checked") == true) {
                    window.localStorage.setItem("showTitle", "true");
                    $("#titleSwitch").prop("checked", true);
                } else {
                    window.localStorage.setItem("showTitle", "false");
                    $("#titleSwitch").prop("checked", false);
                }                
                
                //window.localStorage.setItem("cycle", "0");
                
                window.localStorage.setItem("volume", setVolume);
                window.localStorage.setItem("audioS", audioS);
                window.localStorage.setItem("audioL", audioL);
                window.localStorage.setItem("audioW", audioW);
                
                // 設定完成後預設顯示工作時間
                var display = $("#userWork").val();
                
                if ( display < 10 && display.length == 1) {
                    $("#showTime").text("0" + display + ":00");
                } else if (display <= 60 && display.length < 3) {
                    $("#showTime").text(display + ":00");
                }               
                
                console.log("custom setting set!");
                console.log(window.localStorage["volume"]);
            }
            
            
            $("#btnConfirm").on("click", setCustom);
            $("#btnDefault").on("click", constructor);

            //----------------------------提示功能與聲音-----------------------------
            
            // 音樂代號
            
            // sound1: Baila_Mi_Cumbia_Sting
            // sound2: Dewey_Cheedham_and_Howe_Sting
            // sound3: Cartoon_Bank_Heist_Sting
            
                        
            // 工作時間結束
            var soundWork = new Audio("audio/"+ window.localStorage.getItem("audioW") + ".mp3");
            

            // 長休息時間結束
            var soundLong = new Audio("audio/"+ window.localStorage.getItem("audioL") + ".mp3");
            

            // 短休息時間結束
            var soundShort = new Audio("audio/"+ window.localStorage.getItem("audioS") + ".mp3");
            

            // 測試音效
            var soundTest = new Audio("audio/Pop.mp3");
            
            var soundName;
            var soundTestA = null;
            
            // 選單音樂雙擊試聽
            $("label[for='audioSelWork']").on("dblclick", function () {
                soundName = ($("#audioSelWork").prop("value"));
                soundTestA  = new Audio("audio/"+ soundName +".mp3");
                soundTestA.currentTime = 0;
                soundTestA.volume = 0.2;
                soundTestA.play();
            });
           
            $("label[for='audioSelShort']").on("dblclick", function () {
                soundName = ($("#audioSelShort").prop("value"));
                soundTestA = new Audio("audio/"+ soundName +".mp3");
                soundTestA.currentTime = 0;
                soundTestA.volume = 0.2;
                soundTestA.play();
            });
            
            $("label[for='audioSelLong']").on("dblclick", function () {
                soundName = ($("#audioSelLong").prop("value"));
                soundTestA = new Audio("audio/"+ soundName +".mp3");
                soundTestA.currentTime = 0;
                soundTestA.volume = 0.2;
                soundTestA.play();
            });
            
            
            // mouseleave--stop music preview
            $("label[for='audioSelWork']").on("mouseleave", function() {
                    soundTestA.pause();
                    soundTestA = null;
            });
            
            $("label[for='audioSelShort']").on("mouseleave", function() {
                    soundTestA.pause();
                    soundTestA = null;
            });
            
            $("label[for='audioSelLong']").on("mouseleave", function() {
                    soundTestA.pause();
                    soundTestA = null;
            });
            

            // -----------------------桌面通知 Notification API------------------------

            // 讓使用者檢查通知是否已開啟
            function checkBrowser() {
                if (window.Notification) {
                    alert("允許視窗通知才能收到提醒哦!");
                    Notification.requestPermission(function(status) {
                        if (Notification.permission === "granted") {
                            // 如果已經授權就可以直接新增 Notification 了!
                            var img = "img/tomato-sauce.png";
                            var notification = new Notification("哈囉!", { body: "通知已經打開囉!^_^", icon: img });
                            soundTest.play();
                            setTimeout(notification.close.bind(notification), 5000);
                        }
                        else {
                            alert("通知功能沒設定允許, 時間到了不會提醒喔~");
                        }
                    });
                }
                else {
                    alert("這個瀏覽器不支援桌面通知功能!");
                }
            }

            // 提醒視窗訊息_桌面通知版
            function notificationDesktop() {

                if (choice == "") {
                    // 建立新提醒視窗
                    var img = "img/tomato-sauce.png";
                    var notification = new Notification("來顆番茄鐘", { body: "休息時間到囉! 站起來動一動吧~", icon: img });
                    soundWork.volume = window.localStorage.getItem("volume");
                    // 播放音效
                    soundWork.play();
                    // 設定秒數自動關閉提醒
                    setTimeout(notification.close.bind(notification), 10000);
                    // 使用者提前點選
                    notification.onclick = function(event) {
                        notification.close();
                        soundWork.pause();
                    };
                }
                if (choice == "work") {
                    var img1 = "img/tomato-sauce.png";
                                        
                    var notification = new Notification("來顆番茄鐘", { body: "休息時間到囉! 休息", icon: img1 });
                    soundWork.volume = window.localStorage.getItem("volume");
                    soundWork.play();
                    setTimeout(notification.close.bind(notification), 10000);
                    notification.onclick = function(event) {
                        // already uses autoContiune
                        // notification.close();
                        // choice = "short";
                        // startFunc();
                        soundWork.pause();
                    };
                }
                if (choice == "short") {
                    var img2 = "img/tomato-sauce.png";
                    var notification = new Notification("來顆番茄鐘", { body: (window.localStorage["shortB"]/60)+" 分鐘一下就過啦~ 繼續努力!!", icon: img2 });
                    soundShort.volume = window.localStorage.getItem("volume");
                    soundShort.play();
                    setTimeout(notification.close.bind(notification), 10000);
                    notification.onclick = function(event) {
                        // notification.close();
                        // choice = "work";
                        // startFunc();
                        soundShort.pause();
                    };
                }
                if (choice == "long") {
                    var img3 = "img/tomato-sauce.png";
                    var notification = new Notification("來顆番茄鐘", { body: "該繼續工作囉! GO! GO! GO!", icon: img3 });
                    soundLong.volume = window.localStorage.getItem("volume");
                    soundLong.play();
                    setTimeout(notification.close.bind(notification), 10000);
                    notification.onclick = function(event) {
                        // notification.close();
                        // choice = "work";
                        // startFunc();
                        soundLong.pause();
                    };
                }
            }

            // 提醒視窗(Alert版) [手機端上沒有聲音]
            function notificationAlert() {
                if (choice == "") {
                    alert("休息時間到囉! 站起來動一動吧~");
                    soundWork.play();
                }
                else if (choice == "work") {
                    alert("休息時間到囉! 站起來動一動吧~");
                    soundWork.play();
                }
                else if (choice == "short") {
                    alert((window.localStorage["shortB"]/60)+"分鐘一下就過啦~ 繼續努力!!");
                    soundShort.play();
                }
                else if (choice == "long") {
                    alert("休息完了嗎? 來工作吧!");
                    soundLong.play();
                }
            }

            // 選擇使用哪種提醒視窗
            function myNoti() {
                if (window.Notification) {
                    notificationDesktop();
                }
                else {
                    notificationAlert();
                }
            }

            //---------------------------主要運算------------------------------
            var myVar; //setInterval的變數
            var ms; // 總秒數儲存變數
            
            
            // 引擎啟動
            function engineStart() {
                myVar = setInterval(function() {
                    coreEng();
                    displayTime();
                }, 1000);
            }

            // 運算引擎
            function coreEng() {
                //console.log("ms: " + ms);
                // 計算公式
                // var mm = Math.floor(ms / 60);
                // var ss = ms % 60;

                // 每一循環減一秒
                ms = ms - 1;

                // 秒數歸零時結束Interval, 觸發提醒視窗,自動執行下一步.
                if (ms == 0) {
                    if (window.localStorage.getItem("autoContinue") == "true") {
                        clearInterval(myVar);
                        myNoti();
                        autoContinue();
                    } else {
                        clearInterval(myVar);
                        myNoti();
                        workTimes, shortTimes, cycle = 0;
                    }
                }
                    
            }

            // 顯示時間
            function displayTime() {
                // 分的顯示變數, 秒的顯示變數
                var showMin = Math.floor(ms / 60);
                var showSec = ms % 60;
                
                // 判斷分的位數
                if (showMin < 10) {
                    showMin = "0" + showMin;
                    if (showSec < 10) {
                        showSec = "0" + showSec;
                    }
                    else {
                        showSec = showSec;
                    }
                }
                //判斷秒的位數
                else {
                    if (showSec < 10) {
                        showSec = "0" + showSec;
                    }
                    else {
                        showSec = showSec;
                    }
                }

                // 顯示時間 (01:59 // 0102  // 0000 // 1125 // 1102)
                $("#showTime").text(showMin + ":" + showSec);
                
                // 同步在標題列顯示時間
                if (window.localStorage.getItem("showTitle") == "true") {
                    document.title = "(" + showMin + ":" + showSec + ") " + "來顆番茄鐘!";
                }else {
                    document.title = "來顆番茄鐘!";
                }
                
            }
            
            
            //  自動執行參數
            var workTimes = 0; // 工作次數
            var shortTimes = 0; // 短休息次數
            var cycle = 0;  // 循環次數

            // 自動執行(工作時間到直接跳到休息時間)
            function autoContinue() {
                
                switch (choice) {
                    case "work": case "":
                        workTimes++;
                        if (workTimes + shortTimes >= 7 && (workTimes + shortTimes) % 7 == 0) {
                            cycle++;
                            $("#btnLongBk").trigger("click");
                            console.log(cycle);
                        } else {
                            $("#btnShortBk").trigger("click");
                        }
                        console.log("WT: "+workTimes);
                    break;
                    case "short":
                        shortTimes++;
                        $("#btnWork").trigger("click");
                        console.log("ST: "+shortTimes)
                    break;
                    case "long":
                        $("#btnWork").trigger("click");
                    break;
                    default:
                    console.log("Error");
                    location.reload(true);
                }
                
                

            }


            // ------------------------------功能類別判斷--------------------------------
            // 使用者選擇的時間模式
            var choice = ""; // (work, short, long)

            // 工作時間按鈕
            $("#btnWork").on("click", function() {
                clearInterval(myVar);
                ms = window.localStorage.getItem("work");
                engineStart();
                choice = "work";
            });

            // 短休息按鈕
            $("#btnShortBk").on("click", function() {
                clearInterval(myVar);
                ms = window.localStorage.getItem("shortB");
                engineStart();
                choice = "short";
            });

            // 長休息按鈕
            $("#btnLongBk").on("click", function() {
                clearInterval(myVar);
                ms = window.localStorage.getItem("longB");
                engineStart();
                choice = "long";
            });

            // 開始按鈕(也要有continue的功能)
            $("#btnStart").on("click", startFunc);

            // 開始動作function
            function startFunc() {
                // 判斷目前使用者選定的計時模式
                if (choice == "") {
                    ms = window.localStorage.getItem("work");
                    engineStart();
                    console.log("Start Empty");
                    // 取消綁定按鈕(避免使用者重複點選造成程式錯亂)
                    $("#btnStart").unbind("click");
                }
                else if (choice == "work") {
                    ms = window.localStorage.getItem("work");
                    engineStart();
                    console.log("Start work");
                    $("#btnStart").unbind("click");
                }
                else if (choice == "short") {
                    ms = window.localStorage.getItem("shortB");
                    engineStart();
                    console.log("Start short");
                    $("#btnStart").unbind("click");
                }
                else if (choice == "long") {
                    ms = window.localStorage.getItem("longB");
                    engineStart();
                    console.log("Start long");
                    $("#btnStart").unbind("click");
                }
            }

            // 暫停按鈕
            $("#btnOff").on("click", function() {
                clearInterval(myVar);

                // 重新綁定開始按鈕
                $("#btnStart").bind("click", function() {
                    clearInterval(myVar);
                    engineStart();
                    $("#btnStart").unbind("click");
                });

                console.log("stop");
                return;
            });

            //重設
            $("#btnReset").on("click", function() {
                // 條件判斷當下時間模式進行重設
                if (choice == "") {
                    console.log("Reset 25-1");
                    clearInterval(myVar);
                    ms = window.localStorage.getItem("work");
                    workTimes, shortTimes, cycle = 0;
                    displayTime();
                    $("#btnStart").bind("click");
                }
                else if (choice == "work") {
                    console.log("Reset 25-2");
                    clearInterval(myVar);
                    ms = window.localStorage.getItem("work");
                    workTimes, shortTimes, cycle = 0;
                    displayTime();
                    $("#btnStart").bind("click");
                }
                else if (choice == "short") {
                    console.log("Reset 5");
                    clearInterval(myVar);
                    ms = window.localStorage.getItem("shortB");
                    workTimes, shortTimes, cycle = 0;
                    displayTime();
                    $("#btnStart").bind("click");
                }
                else if (choice == "long") {
                    console.log("Reset 10");
                    clearInterval(myVar);
                    ms = window.localStorage.getItem("longB");
                    workTimes, shortTimes, cycle = 0;
                    displayTime();
                    $("#btnStart").bind("click");
                }
            });

            // 開啟通知按鈕
            $("#btnAlert").on("click", function() {
                checkBrowser();
            });
            
            // 開啟設定對話盒
            $("#triggerModal").click(function() {
                $("#settingModal").modal();
            });
            
            // 開啟介紹對話盒
            $("#triggerIntroModal").on("click",function() {
                $("#introModal").modal();
            });
            
            // 開啟操作說明對話盒
            $("#triggerHowModal").on("click",function() {
                $("#howModal").modal();
            });
            
            // ---------------------------END of the Program---------------------------------
        });