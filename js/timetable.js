document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("timetable-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        alert("📚 当前课表功能尚在开发中，可在 /js/timetable.js 中自定义你的课程表！");
        // 这里未来可以改成弹窗+表格的形式
    });
});
