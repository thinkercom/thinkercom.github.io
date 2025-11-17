/**
 * toolkit-todo.js
 * 负责：工具组弹出按钮 + 自适应待办面板（保存/恢复/响应式/动画）
 * 依赖：GSAP (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.x/gsap.min.js)
 *
 * 保存为 toolkit-todo.js 并在页面中引入（确保 DOM 已准备好）
 */

(function () {
  // 元素选择（容错处理）获取ID
  const toolkitBtn = document.getElementById("toolkit-btn");
  const buttons = document.querySelectorAll(".circle-btn");
  const todoPanel = document.getElementById("todo-panel");
  // const closeTodoBtn = document.getElementById("close-todo");
  const closeTodoBtn = document.querySelector('#close-todo, #todo-close, [data-close="todo"]');
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
    
  }

  // 按钮弹出位置（可调整）
const positions = [
  { x: -110, y: -30 }, // 左上
  { x: -85, y: -85 },   // 中上x-负的越多，越往左，y负的越多越往上
  { x: -30, y: -110 }   // 右上
];

  // 初始化状态
  let isOpen = false; // 主工具按钮是否打开
  // 初始化隐藏状态（scale 0, opacity 0）
  gsap.set(buttons, { scale: 0, opacity: 0, x: 0, y: 0 });
// ================================================
  // --- 工具按钮（主按钮）点击逻辑 ---
  toolkitBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    if (isOpen) {
      buttons.forEach((btn, i) => {
        gsap.to(btn, {
          x: positions[i].x,
          y: positions[i].y,
          scale: 0.8,
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
// =================================================
  // 点击 document 空白处收回小按钮 & 收起 todo 面板（可以调整）
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
          window.location.href = "https://thinkercom.github.io/nav";
          // alert("帮助：在待办中填写事项，点击保存即可保存在本地。");
          break;

        default:
          console.log("未知按钮索引：", i);
      }

      // 点击任何功能按钮后可以选择收起小按钮
      isOpen = false;
      closeAllSmallButtons();
    });
  });

  // ★★★ 新增/修复：初始稳定处理，避免 CSS transition 与 GSAP 冲突，并将面板初始隐藏（无动画）
  if (todoPanel) {
    // 禁止 CSS 的 transition 影响 JS 动画（也会在 adjustTodoPanelLayout 中再次设置）
    todoPanel.style.transition = "none";
    // 禁止面板在隐藏时响应鼠标事件，避免点击到不可见区域
    todoPanel.style.pointerEvents = "none";
    // 确保面板初始透明（GSAP 会控制显隐）
    gsap.set(todoPanel, { opacity: 0 });
    // 立即把面板放到合适的隐藏位置（按当前视口）
    (function initHidePosition() {
      const w = window.innerWidth;
      if (w >= 1024) {
        todoPanel.style.right = "-100%";
        todoPanel.style.bottom = "auto";
        todoPanel.style.top = "0";
      } else {
        todoPanel.style.bottom = "-100%";
        todoPanel.style.right = "auto";
      }
    })();
  }

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
      // todoPanel.style.height = `${Math.round(w * 0.10)}px`;
      todoPanel.style.top = "0";
      todoPanel.style.left = "auto";
      todoPanel.style.right = "-100%"; // 隐藏在右侧
      todoPanel.style.bottom = "auto";
      todoPanel.style.borderRadius = "12px 0 0 12px";
    }
    // 平板 (>= 768 && < 1024)
    else if (w >= 768) {
      todoPanel.style.width = `${Math.round(w * 0.40)}px`;
      // todoPanel.style.height = `${Math.round(h * 0.80)}px`;
      todoPanel.style.bottom = "-100%"; // 隐藏在底部
      todoPanel.style.right = "20px";
      todoPanel.style.left = "auto";
      todoPanel.style.top = "auto";
      todoPanel.style.borderRadius = "12px";
    }
    // 手机 (< 768)
    else {
      todoPanel.style.width = "100%";
      // todoPanel.style.height = `${Math.round(h * 0.60)}px`;
      todoPanel.style.left = "0";
      todoPanel.style.right = "auto";
      todoPanel.style.bottom = "-100%"; // 隐藏在底部
      todoPanel.style.top = "auto";
      todoPanel.style.borderRadius = "16px 16px 0 0";
    }
  }
// 打开待办面板
  function openTodoPanel() {
    if (!todoPanel) return;
    adjustTodoPanelLayout();
    const w = window.innerWidth;

    todoPanel.dataset.visible = "true";
    // 在打开时允许面板响应交互，并清理旧的 transform 属性
    todoPanel.style.pointerEvents = "auto";
    // 清理可能残留的 transform（避免之前动画干扰）
    gsap.set(todoPanel, { clearProps: "transform" });

    // 使用 GSAP 动画到目标位置（保留你原有的 right/bottom 逻辑）
    if (w >= 1024) {
      // 桌面：从右侧滑入
      gsap.to(todoPanel, {
        right: 0,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1,0.6)",
        onComplete() {
          // ★★★ 新增：确保位置属性被写死，避免后续 resize 问题
          todoPanel.style.right = "0";
          todoPanel.style.bottom = "auto";
          // 清除 transform（只保留控制的属性）
          gsap.set(todoPanel, { clearProps: "transform" });
        }
      });
    } else if (w >= 768) {
      // 平板：底部弹起到 20px
      gsap.to(todoPanel, {
        bottom: 20,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1,0.6)",
        onComplete() {
          todoPanel.style.bottom = "20px";
          gsap.set(todoPanel, { clearProps: "transform" });
        }
      });
    } else {
      // 手机：底部弹起到 0
      gsap.to(todoPanel, {
        bottom: 0,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1,0.6)",
        onComplete() {
          todoPanel.style.right = "0";

          gsap.set(todoPanel, { clearProps: "transform" });

        }
      });
    }
  }
  function hideTodoPanel(immediate = false) {
    if (!todoPanel) return;
    const w = window.innerWidth;
    todoPanel.dataset.visible = "false";

    // ★★★ 新增/修复：在隐藏时先禁用交互，避免点击穿透到不可见区域
    todoPanel.style.pointerEvents = "none";

    if (immediate) {
      // 立即隐藏（不做动画），确保写入样式，避免 CSS transition 干扰
      if (w >= 1024) {
        todoPanel.style.right = "-100%";
        todoPanel.style.bottom = "auto";
      } else {
        todoPanel.style.bottom = "-100%";
        todoPanel.style.right = "0";
      }
      gsap.set(todoPanel, { opacity: 0, clearProps: "transform" });
      return;
    }

    // 用 GSAP 执行动画隐藏，并在动画完成后清理可能残留的 transform
    if (w >= 1024) {
      gsap.to(todoPanel, {
        right: "-100%",
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete() {
          // ★★★ 新增：确保隐藏后写回最终样式并清理 transform
          todoPanel.style.right = "-100%";
          todoPanel.style.bottom = "auto";
          gsap.set(todoPanel, { clearProps: "transform" });
        }
      });
    } else {
      gsap.to(todoPanel, {
        bottom: "-100%",
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        onComplete() {
          todoPanel.style.bottom = "-100%";
          todoPanel.style.right = "auto";
          gsap.set(todoPanel, { clearProps: "transform" });
        }
      });
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
  // hidePanelImmediatelyToAvoidCenterFlash();

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

/* ======================
  点击 “＋” 或 Enter 添加任务
   ====================== */

const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");

// 读取已有任务
let todos = JSON.parse(localStorage.getItem("todos") || "[]");

renderTodoList();

function updateScrollMode() {
    const list = document.getElementById("todo-list");
    const items = list.children.length;

    if (items >= 6) {
        list.classList.add("scroll-mode");
    } else {
        list.classList.remove("scroll-mode");
    }
}
function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    // 检查是否出现email标记
    const hasEmailTag = text.includes(" email");

    const list = document.getElementById("todo-list");

    // 创建外层 todo-item
    const item = document.createElement("div");
    item.className = "todo-item";

    // 创建左侧内容
    const todoLeft = document.createElement("div");
    todoLeft.className = "todo-left";
    
    // 创建圆圈标记
    const check = document.createElement("div");
    check.className = "todo-check";
    
    // 创建任务文字容器
    const textContainer = document.createElement("div");
    textContainer.className = "todo-text";
    
    // 创建任务标题
    const title = document.createElement("div");
    title.className = "todo-title";
    title.textContent = text;
    
    // 创建任务描述
    const desc = document.createElement("div");
    desc.className = "todo-desc";
    desc.textContent = "任务";
    
    // 组装左侧内容
    textContainer.appendChild(title);
    textContainer.appendChild(desc);
    todoLeft.appendChild(check);
    todoLeft.appendChild(textContainer);
    
    // 创建右侧操作按钮容器
    const actions = document.createElement("div");
    actions.className = "todo-actions";
    
    // 创建邮箱按钮
    const mailBtn = document.createElement("button");
    mailBtn.className = "mail-btn";
    mailBtn.innerHTML = "📫";
    
    // 创建删除按钮
    const del = document.createElement("button");
    del.className = "todo-delete";
    del.textContent = "×";
    
    // 组装操作按钮
    actions.appendChild(mailBtn);
    actions.appendChild(del);
    
    // 组装整个待办事项
    item.appendChild(todoLeft);
    item.appendChild(actions);

    // 删除逻辑
    del.onclick = () => {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        setTimeout(() => {
            list.removeChild(item);
            // 更新todos数组
            todos = todos.filter(todo => todo.title !== text);
            saveTodos();
            // 重新渲染列表（如果任务为空则不显示邮箱按钮）
            renderTodoList();
            if (typeof updateScrollMode === "function") {
                updateScrollMode();
            }
        }, 200);
    };
    
    // 邮箱按钮逻辑
    mailBtn.onclick = () => {
        // alert("邮箱功能待实现");
        sendTaskEmail(text);
    };

    // 插入到列表（在全局mail-btn之前）
    const globalMailBtn = list.querySelector('.mail-btn:not(.todo-actions .mail-btn)');
    if (globalMailBtn) {
        list.insertBefore(item, globalMailBtn);
    } else {
        list.appendChild(item);
    }

    // 添加任务到数组
    const newTodo = {
        id: Date.now(),
        title: text,
        desc: "任务",
        star: false
    };
    todos.push(newTodo);
    saveTodos();

    // 清空输入框
    input.value = "";

    if (hasEmailTag) {
        // 移除 " email" 后的部分，只保留任务标题
        const taskTitle = text.replace(/ email$/, "");
        sendTaskEmail(taskTitle);
    }

    // 如果你之前写了自动滚动控制函数，则调用
    if (typeof updateScrollMode === "function") {
        updateScrollMode();
    }
}

// 按钮添加
addTodoBtn.addEventListener("click", addTodo);
updateScrollMode();

// 回车也能添加
todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo();
    updateScrollMode();
});

/* ======================
    渲染列表
   ====================== */

function renderTodoList() {
    todoList.innerHTML = "";

    todos.forEach((item) => {
        const row = document.createElement("div");
        row.className = "todo-item";

        row.innerHTML = `
            <div class="todo-left">
                <div class="todo-check"></div>
                <div class="todo-text">
                    <div class="todo-title">${item.title}</div>
                    <div class="todo-desc">${item.desc}</div>
                </div>
            </div>
            <div class="todo-actions">
                <button class="mail-btn">📫</button>
                <button class="todo-delete">×</button>
            </div>
        `;

        // 删除按钮事件
        row.querySelector(".todo-delete").addEventListener("click", () => {
            row.style.opacity = "0";
            row.style.transform = "translateX(20px)";
            setTimeout(() => {
                todoList.removeChild(row);
                // 更新todos数组
                todos = todos.filter(todo => todo.id !== item.id);
                saveTodos();
                // 重新渲染列表
                renderTodoList();
                if (typeof updateScrollMode === "function") {
                    updateScrollMode();
                }
            }, 200);
        });
        
        // 邮箱按钮事件
        row.querySelector(".mail-btn").addEventListener("click", () => {
            alert("邮箱功能待实现: " + item.title);
            sendTaskEmail(item.title);
        });

        todoList.appendChild(row);
    });
    
    // 只有当有任务时才显示全局mail-btn按钮
    // if (todos.length > 0) {
    //     const globalMailBtn = document.createElement("div");
    //     globalMailBtn.className = "mail-btn";
    //     globalMailBtn.innerHTML = "📫";
    //     todoList.appendChild(globalMailBtn);
    // }
}
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function sendTaskEmail(taskTitle) {
    // 初始化 EmailJS，使用你的实际 Public Key
    emailjs.init("PrBa5UmMPPfwS_eIh");
    
    // 发送邮件，使用你的实际 Service ID 和 Template ID
    emailjs.send("service_b22ztvf", "template_hqu24yj", {
        to_name: "任务接收者",
        from_name: "待办任务系统",
        message: "您有一个新的待办任务: " + taskTitle,
        to_email: "3241233221@qq.com"  // 这里应该是任务指定的邮箱地址
    })
    .then(function(response) {
        console.log("任务邮件发送成功！", response.status, response.text);
        alert("任务已成功发送到邮箱！");
    }, function(error) {
        console.log("任务邮件发送失败...", error);
        alert("发送失败，请检查网络连接或联系管理员。");
    });
}

function sendEmail() {
      emailjs.init("PrBa5UmMPPfwS_eIh"); // TODO: 替换成自己的PublicKey
      emailjs.send("service_b22ztvf", "template_p63js2f", {  // TODO: 替换成自己的serviceID、templateID
        to_name: "满天",
        from_name: "满天",
        message: "测试邮件正文邮件正文",
        to_email: "3241233221@qq.com",  // 接收邮箱
        })
        .then(function(response) {
        console.log("邮件发送成功！", response.status, response.text);
        }, function(error) {
        console.log("邮件发送失败...", error);
        });
    }
