/*Created by Daniel Huang 2018
    番茄钟
    Bug 反馈: https://ppt.cc/fITn4x
*/

$(document).ready(function() {
            
    //--------------------------------背景画面轮播---------------------------------
    
    // 背景画面轮播 API
    // https://github.com/jquery-backstretch/jquery-backstretch
    
    $.backstretch([
        './background/bg1_book.png',
        './background/bg2_cat.png',
        './background/bg3_cu.jpg',
    ], {
        fade: 1000, // 淡入淡出
        duration: 15000 // 每几秒切换
    });
    
    //--------------------------------初始化/用户自定义---------------------------------
    function constructor() {
        window.localStorage.clear();                
        
        // 时间
        window.localStorage.setItem("work","1500");
        window.localStorage.setItem("shortB","300");
        window.localStorage.setItem("longB","600");
        
        // 其他设置
        window.localStorage.setItem("showTitle","true");
        window.localStorage.setItem("autoContinue", "true");
        
        //window.localStorage.setItem("cycle", "0");
        
        window.localStorage.setItem("volume", "0.5");
        window.localStorage.setItem("audioS", "Dewey");
        window.localStorage.setItem("audioL", "Cartoon");
        window.localStorage.setItem("audioW", "Baila");
        
        // 显示的时间
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
        
        var setVolume = $("#setVolume").val();
        var audioS = $("#audioSelShort").val();
        var audioL = $("#audioSelLong").val();
        var audioW = $("#audioSelWork").val();

        // 判断用户输入的时间是否正确
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
        
        // 设置完成后默认显示工作时间
        var display = $("#userWork").val();
        
        if ( display < 10 && display.length == 1) {
            $("#showTime").text("0" + display + ":00");
        } else if (display <= 60 && display.length < 3) {
            $("#showTime").text(display + ":00");
        }               
        
        console.log("自定义设置完成!");
        console.log(window.localStorage["volume"]);
    }
    
    
    $("#btnConfirm").on("click", setCustom);
    $("#btnDefault").on("click", constructor);

    //----------------------------提示功能与声音-----------------------------
    
    // 音乐代号
    
    // sound1: Baila_Mi_Cumbia_Sting
    // sound2: Dewey_Cheedham_and_Howe_Sting
    // sound3: Cartoon_Bank_Heist_Sting
    
                
    // 工作时间结束
    var soundWork = new Audio("audio/"+ window.localStorage.getItem("audioW") + ".mp3");
    

    // 长休息时间结束
    var soundLong = new Audio("audio/"+ window.localStorage.getItem("audioL") + ".mp3");
    

    // 短休息时间结束
    var soundShort = new Audio("audio/"+ window.localStorage.getItem("audioS") + ".mp3");
    

    // 测试音效
    var soundTest = new Audio("audio/Pop.mp3");
    
    var soundName;
    var soundTestA = null;
    
    // 双击试听
    $("label[for='audioSelWork']").on("click", function () {
        soundName = ($("#audioSelWork").prop("value"));
        soundTestA  = new Audio("audio/"+ soundName +".mp3");
        soundTestA.currentTime = 0;
        soundTestA.volume = 0.2;
        soundTestA.play();
    });
   
    $("label[for='audioSelShort']").on("click", function () {
        soundName = ($("#audioSelShort").prop("value"));
        soundTestA = new Audio("audio/"+ soundName +".mp3");
        soundTestA.currentTime = 0;
        soundTestA.volume = 0.2;
        soundTestA.play();
    });
    
    $("label[for='audioSelLong']").on("click", function () {
        soundName = ($("#audioSelLong").prop("value"));
        soundTestA = new Audio("audio/"+ soundName +".mp3");
        soundTestA.currentTime = 0;
        soundTestA.volume = 0.2;
        soundTestA.play();
    });
    
    
    // 鼠标离开停止试听
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

    // 让用户检查通知是否已开启
    function checkBrowser() {
        if (window.Notification) {
            alert("允许窗口通知才能收到提醒哦!");
            Notification.requestPermission(function(status) {
                if (Notification.permission === "granted") {
                    // 如果已经授权就可以直接新增 Notification 了!
                    var img = "img/tomato-sauce.png";
                    var notification = new Notification("你好!", { body: "通知已经打开啦!^_^", icon: img });
                    soundTest.play();
                    setTimeout(notification.close.bind(notification), 5000);
                }
                else {
                    alert("通知功能未开启，时间到不会提醒哦~");
                }
            });
        }
        else {
            alert("这个浏览器不支持桌面通知功能!");
        }
    }

    // 提醒窗口信息_桌面通知版
    function notificationDesktop() {

        if (choice == "") {
            var img = "img/tomato-sauce.png";
            var notification = new Notification("来颗番茄钟", { body: "休息时间到啦! 站起来动一动吧~", icon: img });
            soundWork.volume = window.localStorage.getItem("volume");
            soundWork.play();
            setTimeout(notification.close.bind(notification), 10000);
            notification.onclick = function(event) {
                notification.close();
                soundWork.pause();
            };
        }
        if (choice == "work") {
            var img1 = "img/tomato-sauce.png";
                                
            var notification = new Notification("来颗番茄钟", { body: "休息时间到啦! 起身动一动吧~", icon: img1 });
            soundWork.volume = window.localStorage.getItem("volume");
            soundWork.play();
            setTimeout(notification.close.bind(notification), 10000);
            notification.onclick = function(event) {
                soundWork.pause();
            };
        }
        if (choice == "short") {
            var img2 = "img/tomato-sauce.png";
            var notification = new Notification("来颗番茄钟", { body: (window.localStorage["shortB"]/60)+" 分钟一下就过去啦~ 继续加油!!", icon: img2 });
            soundShort.volume = window.localStorage.getItem("volume");
            soundShort.play();
            setTimeout(notification.close.bind(notification), 10000);
            notification.onclick = function(event) {
                soundShort.pause();
            };
        }
        if (choice == "long") {
            var img3 = "img/tomato-sauce.png";
            var notification = new Notification("来颗番茄钟", { body: "该继续工作啦! GO! GO! GO!", icon: img3 });
            soundLong.volume = window.localStorage.getItem("volume");
            soundLong.play();
            setTimeout(notification.close.bind(notification), 10000);
            notification.onclick = function(event) {
                soundLong.pause();
            };
        }
    }

    // 提醒窗口(Alert版) [手机端上没有声音]
    function notificationAlert() {
        if (choice == "") {
            alert("休息时间到啦! 站起来动一动吧~");
            soundWork.play();
        }
        else if (choice == "work") {
            alert("休息时间到啦! 站起来动一动吧~");
            soundWork.play();
        }
        else if (choice == "short") {
            alert((window.localStorage["shortB"]/60)+"分钟一下就过去啦~ 继续加油!!");
            soundShort.play();
        }
        else if (choice == "long") {
            alert("休息完了吗? 来工作吧!");
            soundLong.play();
        }
    }

    // 选择使用哪种提醒窗口
    function myNoti() {
        if (window.Notification) {
            notificationDesktop();
        }
        else {
            notificationAlert();
        }
    }

    //---------------------------主要运算------------------------------
    var myVar; //setInterval的变量
    var ms; // 总秒数储存变量
    
    
    // 引擎启动
    function engineStart() {
        myVar = setInterval(function() {
            coreEng();
            displayTime();
        }, 1000);
    }

    // 运算引擎
    function coreEng() {
        ms = ms - 1;

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

    // 显示时间
    function displayTime() {
        var showMin = Math.floor(ms / 60);
        var showSec = ms % 60;
        
        if (showMin < 10) {
            showMin = "0" + showMin;
            if (showSec < 10) {
                showSec = "0" + showSec;
            }
        } else {
            if (showSec < 10) {
                showSec = "0" + showSec;
            }
        }

        $("#showTime").text(showMin + ":" + showSec);
        
        if (window.localStorage.getItem("showTitle") == "true") {
            document.title = "(" + showMin + ":" + showSec + ") " + "来颗番茄钟!";
        }else {
            document.title = "来颗番茄钟!";
        }
        
    }
    
    
    //  自动执行参数
    var workTimes = 0; // 工作次数
    var shortTimes = 0; // 短休息次数
    var cycle = 0;  // 循环次数

    // 自动执行(工作时间结束直接跳到休息时间)
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


    // ------------------------------功能模式--------------------------------
    var choice = ""; // (work, short, long)

    // 工作时间按钮
    $("#btnWork").on("click", function() {
        clearInterval(myVar);
        ms = window.localStorage.getItem("work");
        engineStart();
        choice = "work";
    });

    // 短休息按钮
    $("#btnShortBk").on("click", function() {
        clearInterval(myVar);
        ms = window.localStorage.getItem("shortB");
        engineStart();
        choice = "short";
    });

    // 长休息按钮
    $("#btnLongBk").on("click", function() {
        clearInterval(myVar);
        ms = window.localStorage.getItem("longB");
        engineStart();
        choice = "long";
    });

    // 开始按钮
    $("#btnStart").on("click", startFunc);

    function startFunc() {
        if (choice == "") {
            ms = window.localStorage.getItem("work");
            engineStart();
            console.log("Start Empty");
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

    // 暂停按钮
    $("#btnOff").on("click", function() {
        clearInterval(myVar);
        $("#btnStart").bind("click", function() {
            clearInterval(myVar);
            engineStart();
            $("#btnStart").unbind("click");
        });
        console.log("stop");
        return;
    });

    // 重置
    $("#btnReset").on("click", function() {
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

    // 开启通知按钮
    $("#btnAlert").on("click", function() {
        checkBrowser();
    });
    
    // 打开设置窗口
    $("#triggerModal").click(function() {
        $("#settingModal").modal();
    });
    // 回到首页
    $("#triggerBackHome").on("click", function() {
        window.location.href = "../index.html"; // 跳转到同目录下的 intro.html
    });
    // 打开介绍窗口
    $("#triggerIntroModal").on("click",function() {
        $("#introModal").modal();
    });
    
    // 打开操作说明窗口
    $("#triggerHowModal").on("click",function() {
        $("#howModal").modal();
    });
    
    // ---------------------------程序结束---------------------------------
});
