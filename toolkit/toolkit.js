const toolkitBtn = document.getElementById("toolkit-btn");
const buttons = document.querySelectorAll(".circle-btn");
let isOpen = false;

const positions = [
  { x: -80, y: -120 }, // 左上
  { x: 0, y: -150 },   // 中上
  { x: 80, y: -120 }   // 右上
];

// 初始化隐藏状态
gsap.set(buttons, { scale: 0, opacity: 0, x: 0, y: 0 });

toolkitBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen = !isOpen;

    if (isOpen) {
    buttons.forEach((btn, i) => {
        gsap.to(btn, {
        x: positions[i].x,
        y: positions[i].y,
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.6)", // 弹簧感关键参数
        delay: i * 0.05 // 稍微错位弹出
        });
    });
    } else {
    buttons.forEach((btn, i) => {
        gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.4)",
        delay: i * 0.03
        });
    });
    }
});

// 点击空白收回
document.addEventListener("click", (event) => {
    if (!toolkitBtn.contains(event.target)) {
    isOpen = false;
    buttons.forEach((btn, i) => {
        gsap.to(btn, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.4)",
        delay: i * 0.03
        });
    });
    }
});
