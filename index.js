const todoForm = document.getElementById("todo-form")
const todoInput = document.getElementById("todo-input")
const todoList = document.getElementById("todo-list")
const stats = document.getElementById("stats")
const progress = document.getElementById("progress")
const filterButtons = document.querySelectorAll(".filter-btn")
const emptyState = document.getElementById("empty-state")

const statTotal = document.getElementById("stat-total")
const statActive = document.getElementById("stat-active")
const statDone = document.getElementById("stat-done")

const dateEl = document.getElementById("current-date")
if (dateEl) {
    const now = new Date()
    dateEl.innerHTML = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    })
}

let todos = JSON.parse(localStorage.getItem("todos")) || []
let currentFilter = "all"

function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos))
}

function updateStats() {
    const completed = todos.filter(todo => todo.completed).length
    const total = todos.length

    stats.textContent = `${completed} / ${total} completed`

    const percent = total === 0 ? 0 : (completed / total) * 100
    progress.style.width = `${percent}%`

    if (statTotal) statTotal.textContent = total
    if (statActive) statActive.textContent = total - completed
    if (statDone) statDone.textContent = completed
}

function getFilteredTodos() {
    if (currentFilter === "active") {
        return todos.filter(todo => !todo.completed)
    }

    if (currentFilter === "completed") {
        return todos.filter(todo => todo.completed)
    }

    return todos
}

function renderTodos() {
    todoList.innerHTML = ""

    const filteredTodos = getFilteredTodos()

    filteredTodos.length === 0
        ? emptyState.style.display = "flex"
        : emptyState.style.display = "none"

    filteredTodos.forEach(todo => {
        const li = document.createElement("li")

        li.className = "todo-item"
        li.dataset.id = todo.id

        li.innerHTML = `
            <input type="checkbox" class="toggle" ${todo?.completed ? "checked" : ""}>
            <span class="todo-text ${todo.completed ? "completed" : ""}">${todo.text}</span>
            <div class="action">
                <button class="edit-btn" title="Edit task">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" title="Delete task">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `

        todoList.appendChild(li)
    })

    updateStats()
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const text = todoInput.value.trim()

    if (!text) return

    const newTodo = {
        id: Date.now(),
        text,
        completed: false
    }

    todos.push(newTodo)
    saveTodo()
    renderTodos()

    todoInput.value = ""
})

todoList.addEventListener("change", e => {
    if (!e.target.classList.contains("toggle")) return

    const li = e.target.closest("li")
    const id = Number(li.dataset.id)

    const todo = todos.find(t => t.id === id)

    todo.completed = !todo.completed
    saveTodo()
    renderTodos()
})

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"))

        button.classList.add("active")

        currentFilter = button.dataset.filter

        renderTodos()
    })
})

todoList.addEventListener("click", e => {
    const li = e.target.closest("li")
    if (!li) return

    const id = Number(li.dataset.id)
    const todo = todos.find(t => t.id === id)

    if (e.target.closest(".delete-btn")) {
        todos = todos.filter(t => t.id !== id)
    }

    if (!todo) return

    if (e.target.closest(".edit-btn")) {
        const newText = prompt("Edit task", todo.text)

        if (newText) {
            todo.text = newText.trim()
        }
    }

    saveTodo()
    renderTodos()
})

renderTodos()