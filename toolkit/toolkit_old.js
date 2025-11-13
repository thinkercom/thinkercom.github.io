/**
 * toolkit-todo.js
 * 负责：工具组弹出按钮 + 自适应待办面板（保存/恢复/响应式/动画）
 * 依赖：GSAP (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.x/gsap.min.js)
 *
 * 保存为 toolkit-todo.js 并在页面中引入（确保 DOM 已准备好）
 */

(function () {
  // 元素选择（容错处理）
  const toolkitBtn = document.getElementById("toolkit-btn");
  const buttons = document.querySelectorAll(".circle-btn");
  const todoPanel = document.getElementById("todo-panel");
  const closeTodoBtn = document.getElementById("close-todo");
  const todoInput = document.getElementById("todo-input");
  const saveTodoBtn = document.getElementById("save-todo");
  const todoStatus = document.getElementById("todo-status");

  // 检查关键元素是否存在，若不存在则记录并退出（避免报错）
  if (!toolkitBtn) {
    console.warn("toolkitBtn 未找到（id='toolkit-btn'），脚本终止。");
    return;
  }
  if (!buttons || buttons.length === 0) {
    console.warn("未找到 .circle-btn 按钮，脚本终止。");
    return;
  }
  if (!todoPanel) {
    console.warn("todoPanel 未找到（id='todo-panel'）。请确认 HTML 中有该元素。");
    // 但我们不完全退出：按钮 0 的跳转仍然可以工作
  }

  // 按钮弹出位置（根据你已有设置，可调整）
  const positions = [
    { x: -110, y: -60 }, // 左上
    { x: -30, y: -120 }, // 中上 (打开 todo)
    { x: 50, y: -60 }    // 右上
  ];

  // 初始化状态
  let isOpen = false; // 主工具按钮是否打开
  // 初始化隐藏状态（scale 0, opacity 0）
  gsap.set(buttons, { scale: 0, opacity: 0, x: 0, y: 0 });

  // --- 工具按钮（主按钮）点击逻辑 ---
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
          ease: "elastic.out(1, 0.6)",
          delay: i * 0.05
        });
      });
    } else {
      closeAllSmallButtons();
    }
  });

  function closeAllSmallButtons() {
    buttons.forEach((btn, i) => {
      gsap.to(btn, {
        x: -30,
        y: -20,
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(1.4)",
        delay: i * 0.03
      });
    });
  }

  // 点击 document 空白处收回小按钮 & 收起 todo 面板（如果需要）
  document.addEventListener("click", (event) => {
    // 如果点击目标在 toolkitBtn 或在展开的小按钮上，则不收回
    if (toolkitBtn.contains(event.target) || Array.from(buttons).some(b => b.contains(event.target))) {
      return;
    }
    // 否则收回小按钮
    isOpen = false;
    closeAllSmallButtons();

    // 如果 todo 面板打开并且点击不在todoPanel内部，收起面板
    if (todoPanel && todoPanel.dataset.visible === "true" && !todoPanel.contains(event.target)) {
      hideTodoPanel();
    }
  });

  // ----------------------------
  // 给每个小按钮绑定功能（索引 i）
  // ----------------------------
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 防止触发 document 的收回逻辑

      switch (i) {
        case 0:
          console.log("左上按钮：打开番茄钟页面（当前窗口）");
          // 打开本地页面（当前窗口），确保路径正确
          window.location.href = "./fsit05-pomodoro-clock/index.html";
          break;

        case 1:
          console.log("中上按钮：打开/收起 待办面板");
          // 使用统一的 open/hide API
          if (!todoPanel) {
            console.warn("todoPanel 未找到，无法打开待办面板。");
            break;
          }
          if (todoPanel.dataset.visible === "true") hideTodoPanel();
          else openTodoPanel();
          break;

        case 2:
          console.log("右上按钮：显示帮助信息");
          // 这里你可以替换为自己的 modal 或其他逻辑
          alert("帮助：在待办中填写事项，点击保存即可保存在本地。");
          break;

        default:
          console.log("未知按钮索引：", i);
      }

      // 点击任何功能按钮后可以选择收起小按钮
      isOpen = false;
      closeAllSmallButtons();
    });
  });

  // ----------------------------
  // 待办面板：加载/保存/关闭/自适应逻辑
  // ----------------------------
  if (todoPanel) {
    // 初始隐藏标记
    todoPanel.dataset.visible = "false";

    // 当 DOM 完成时加载保存的内容并初始化位置
    window.addEventListener("DOMContentLoaded", () => {
      const saved = localStorage.getItem("myTodo");
      if (saved && todoInput) todoInput.value = saved;
      // 初始化布局并把面板移动到隐藏位置（避免短暂居中或闪烁）
      adjustTodoPanelLayout();
      // 根据当前 viewport 隐藏到正确位置
      hideTodoPanel(true); // 参数 true 表示立即隐藏（无动画）
    });

    // 保存
    if (saveTodoBtn && todoInput) {
      saveTodoBtn.addEventListener("click", () => {
        const content = todoInput.value.trim();
        if (content) {
          localStorage.setItem("myTodo", content);
          showTodoStatus("✅ 已保存");
        } else {
          showTodoStatus("⚠️ 内容不能为空");
        }
      });
    }

    // 关闭按钮
    if (closeTodoBtn) {
      closeTodoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hideTodoPanel();
      });
    }

    // 防止点击面板内部时触发 document 收起
    todoPanel.addEventListener("click", (e) => e.stopPropagation());

    // 当窗口尺寸变化，如果面板当前打开则重新调整布局（带动画）
    window.addEventListener("resize", () => {
      if (todoPanel.dataset.visible === "true") {
        // 先调整样式再把面板滑入到正确位置
        adjustTodoPanelLayout();
        // 用短动画把面板移动到当前应该的位置
        repositionVisiblePanel();
      } else {
        // 仍要调整隐藏位置，避免下次打开错位
        adjustTodoPanelLayout();
        hideTodoPanel(true); // 立即设置隐藏位置
      }
    });
  } // end if todoPanel exists

  // 显示短暂状态提示
  function showTodoStatus(msg) {
    if (!todoStatus) return;
    todoStatus.textContent = msg;
    todoStatus.style.opacity = "1";
    // 简单淡出
    setTimeout(() => {
      todoStatus.style.transition = "opacity 0.4s";
      todoStatus.style.opacity = "0";
      // 2s 后清空文本，避免下一次显示残留
      setTimeout(() => (todoStatus.textContent = ""), 400);
    }, 1200);
  }

  // 调整面板的基础布局（不做动画，只设置宽高与初始隐藏位置）
  function adjustTodoPanelLayout() {
    if (!todoPanel) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // 统一过渡（GSAP 将覆盖具体动画）
    todoPanel.style.transition = "none";

    // 桌面（>= 1024）
    if (w >= 1024) {
      todoPanel.style.width = `${Math.round(w * 0.30)}px`; // 占屏 30%
      todoPanel.style.height = `100%`;
      todoPanel.style.top = "0";
      todoPanel.style.left = "auto";
      todoPanel.style.right = "-100%"; // 隐藏在右侧
      todoPanel.style.bottom = "auto";
      todoPanel.style.borderRadius = "12px 0 0 12px";
    }
    // 平板 (>= 768 && < 1024)
    else if (w >= 768) {
      todoPanel.style.width = `${Math.round(w * 0.40)}px`;
      todoPanel.style.height = `${Math.round(h * 0.80)}px`;
      todoPanel.style.bottom = "-100%"; // 隐藏在底部
      todoPanel.style.right = "20px";
      todoPanel.style.left = "auto";
      todoPanel.style.top = "auto";
      todoPanel.style.borderRadius = "12px";
    }
    // 手机 (< 768)
    else {
      todoPanel.style.width = "100%";
      todoPanel.style.height = `${Math.round(h * 0.60)}px`;
      todoPanel.style.left = "0";
      todoPanel.style.right = "auto";
      todoPanel.style.bottom = "-100%"; // 隐藏在底部
      todoPanel.style.top = "auto";
      todoPanel.style.borderRadius = "16px 16px 0 0";
    }
  }

  // 打开面板（使用 GSAP 做平滑弹簧动画）
  function openTodoPanel() {
    if (!todoPanel) return;
    adjustTodoPanelLayout();
    const w = window.innerWidth;

    todoPanel.dataset.visible = "true";

    // 使用 GSAP 动画到目标位置
    if (w >= 1024) {
      gsap.to(todoPanel, { right: 0, duration: 0.6, ease: "elastic.out(1,0.6)" });
    } else if (w >= 768) {
      // 平板：从底部移动到 20px 底边
      gsap.to(todoPanel, { bottom: 20, duration: 0.6, ease: "elastic.out(1,0.6)" });
    } else {
      // 手机：底部上弹到 0
      gsap.to(todoPanel, { bottom: 0, duration: 0.6, ease: "elastic.out(1,0.6)" });
    }
  }

  // 隐藏面板。 immediate=true 表示立即设置位置（无动画）
  function hideTodoPanel(immediate = false) {
    if (!todoPanel) return;
    const w = window.innerWidth;
    todoPanel.dataset.visible = "false";

    if (immediate) {
      // 立即隐藏（不做动画）
      if (w >= 1024) {
        todoPanel.style.right = "-100%";
      } else {
        todoPanel.style.bottom = "-100%";
      }
      return;
    }

    // 用 GSAP 执行动画隐藏
    if (w >= 1024) {
      gsap.to(todoPanel, { right: "-100%", duration: 0.45, ease: "power2.inOut" });
    } else {
      gsap.to(todoPanel, { bottom: "-100%", duration: 0.45, ease: "power2.inOut" });
    }
  }

  // 当面板已经是打开状态（visible），重新定位到正确的可见位置（用于 resize）
  function repositionVisiblePanel() {
    if (!todoPanel) return;
    const w = window.innerWidth;

    if (todoPanel.dataset.visible !== "true") return;

    if (w >= 1024) {
      gsap.to(todoPanel, { right: 0, bottom: "auto", duration: 0.45, ease: "power2.out" });
    } else if (w >= 768) {
      gsap.to(todoPanel, { bottom: 20, right: 20, duration: 0.45, ease: "power2.out" });
    } else {
      gsap.to(todoPanel, { bottom: 0, duration: 0.45, ease: "power2.out" });
    }
  }

  // 初次加载时：确保面板不会闪现到中心（把 transform/left/top 等复位）
  // （在某些环境下，元素可能在 CSS 未生效前以默认布局在页面中间显示）
  function hidePanelImmediatelyToAvoidCenterFlash() {
    if (!todoPanel) return;
    // 隐藏并设置为 off-screen
    adjustTodoPanelLayout();
    hideTodoPanel(true);
  }

  // 调用一次，避免初始闪烁（如果 todoPanel 存在）
  hidePanelImmediatelyToAvoidCenterFlash();

  // 导出到 window（如果你希望在控制台调用）
  window._toolkitTodo = {
    open: openTodoPanel,
    close: hideTodoPanel,
    toggle: function () {
      if (!todoPanel) return;
      if (todoPanel.dataset.visible === "true") hideTodoPanel();
      else openTodoPanel();
    }
  };
})();
