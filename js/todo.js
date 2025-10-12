document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("todo-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const task = prompt("✏️ 输入新的待办事项：");
        if (!task) return;
        const todos = JSON.parse(localStorage.getItem("todos") || "[]");
        todos.push({ task, done: false });
        localStorage.setItem("todos", JSON.stringify(todos));
        alert("✅ 添加成功！");
    });
});
