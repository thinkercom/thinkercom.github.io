document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("pomodoro-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const minutes = prompt("请输入番茄时钟时长（分钟）", 25);
        if (!minutes) return;
        let remaining = minutes * 60;

        const timer = setInterval(() => {
            if (remaining <= 0) {
                clearInterval(timer);
                alert("🍅 番茄时钟结束！休息一下吧！");
            } else {
                document.title = `⏱️ 剩余 ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`;
                remaining--;
            }
        }, 1000);
    });
});
