class TodoManager {
    constructor() {
        this.todos = [];
        this.nextId = 1;
        this.initializeElements();
        this.loadTodos();
    }
    
    initializeElements() {
        this.todoInput = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-todo-btn');
        this.todoList = document.getElementById('todo-list');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTodos(e.target.dataset.filter));
        });
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            const todo = {
                id: this.nextId++,
                text: text,
                completed: false,
                priority: 'medium',
                createdAt: new Date(),
                dueDate: null
            };
            
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';
            
            // 设置提醒
            this.scheduleNotification(todo);
        }
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }
    
    renderTodos(filter = 'all') {
        this.todoList.innerHTML = '';
        
        let filteredTodos = this.todos;
        if (filter === 'active') {
            filteredTodos = this.todos.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filteredTodos = this.todos.filter(todo => todo.completed);
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">删除</button>
            `;
            
            const checkbox = todoItem.querySelector('input');
            const deleteBtn = todoItem.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
            
            this.todoList.appendChild(todoItem);
        });
    }
    
    filterTodos(filter) {
        this.renderTodos(filter);
    }
    
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('nextId', this.nextId);
    }
    
    loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        const savedNextId = localStorage.getItem('nextId');
        
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
        }
        
        if (savedNextId) {
            this.nextId = parseInt(savedNextId);
        }
        
        this.renderTodos();
    }
    
    scheduleNotification(todo) {
        // 如果设置了截止日期，安排通知
        if (todo.dueDate) {
            const dueTime = new Date(todo.dueDate).getTime();
            const now = Date.now();
            const timeUntilDue = dueTime - now;
            
            if (timeUntilDue > 0) {
                setTimeout(() => {
                    this.showTodoNotification(todo);
                }, timeUntilDue);
            }
        }
    }
    
    showTodoNotification(todo) {
        if (Notification.permission === 'granted') {
            new Notification('待办事项提醒', {
                body: `"${todo.text}" 即将到期`,
                icon: 'assets/images/todo-icon.png'
            });
        }
        
        // 发送到移动设备（需要后端支持）
        this.sendToMobile(todo);
    }
    
    async sendToMobile(todo) {
        // 这里需要与后端API集成，实现跨设备同步
        try {
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    todo: todo.text,
                    dueDate: todo.dueDate
                })
            });
            
            if (response.ok) {
                console.log('通知已发送到移动设备');
            }
        } catch (error) {
            console.error('发送通知失败:', error);
        }
    }
}

// 初始化待办事项管理器
document.addEventListener('DOMContentLoaded', () => {
    const todoManager = new TodoManager();
});