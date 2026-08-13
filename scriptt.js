/* =====================================================
   SMART TASK MANAGER
   Complete JavaScript
   ===================================================== */


/* ================= DOM ELEMENTS ================= */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const clearCompleted =
    document.getElementById("clearCompleted");

const themeToggle =
    document.getElementById("themeToggle");

const progressText =
    document.getElementById("progressText");

const progressFill =
    document.getElementById("progressFill");


/* ================= VARIABLES ================= */

let tasks =
    JSON.parse(localStorage.getItem("smartTasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


/* ================= SAVE TASKS ================= */

function saveTasks() {

    localStorage.setItem(
        "smartTasks",
        JSON.stringify(tasks)
    );
}


/* ================= CREATE TASK ID ================= */

function generateId() {

    return Date.now() +
        Math.floor(Math.random() * 1000);
}


/* ================= ADD TASK ================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText =
        taskInput.value.trim();


    if (taskText === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    /* Prevent extremely long tasks */

    if (taskText.length > 150) {

        alert(
            "Task should be less than 150 characters."
        );

        return;
    }


    /* Editing */

    if (editingTaskId !== null) {

        tasks = tasks.map(function (task) {

            if (task.id === editingTaskId) {

                return {
                    ...task,
                    title: taskText
                };
            }

            return task;
        });


        editingTaskId = null;

        taskForm.querySelector(".add-btn").textContent =
            "+ Add Task";

    }

    /* Adding new task */

    else {

        const newTask = {

            id: generateId(),

            title: taskText,

            completed: false,

            priority: "medium",

            createdAt: new Date().toISOString()

        };


        tasks.unshift(newTask);
    }


    saveTasks();

    taskInput.value = "";

    renderTasks();

    updateStatistics();

    taskInput.focus();

});


/* ================= RENDER TASKS ================= */

function renderTasks() {

    taskList.innerHTML = "";


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    let filteredTasks =
        tasks.filter(function (task) {


            /* Search */

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchTerm);


            /* Filter */

            const matchesFilter =

                currentFilter === "all"

                    ? true

                    : currentFilter === "pending"

                        ? !task.completed

                        : task.completed;


            return matchesSearch &&
                   matchesFilter;

        });


    /* Empty state */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredTasks.forEach(function (task) {

        const taskElement =
            createTaskElement(task);

        taskList.appendChild(taskElement);

    });

}


/* ================= CREATE TASK ELEMENT ================= */

function createTaskElement(task) {

    const article =
        document.createElement("article");


    article.className =
        "task-item";


    if (task.completed) {

        article.classList.add("completed");

    }


    /* Checkbox */

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className =
        "task-checkbox";

    checkbox.checked =
        task.completed;


    checkbox.setAttribute(
        "aria-label",
        "Complete task"
    );


    checkbox.addEventListener(
        "change",
        function () {

            toggleTask(task.id);

        }
    );


    /* Content */

    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const title =
        document.createElement("div");

    title.className =
        "task-title";

    title.textContent =
        task.title;


    const meta =
        document.createElement("div");

    meta.className =
        "task-meta";


    const priority =
        document.createElement("span");

    priority.className =
        `priority priority-${task.priority}`;


    priority.textContent =
        capitalize(task.priority);


    const date =
        document.createElement("span");

    date.textContent =
        formatDate(task.createdAt);


    meta.appendChild(priority);

    meta.appendChild(date);


    content.appendChild(title);

    content.appendChild(meta);


    /* Actions */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* Edit button */

    const editButton =
        document.createElement("button");

    editButton.className =
        "task-action";

    editButton.textContent =
        "✏️";

    editButton.title =
        "Edit task";


    editButton.addEventListener(
        "click",
        function () {

            editTask(task.id);

        }
    );


    /* Delete button */

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "task-action delete";

    deleteButton.textContent =
        "🗑️";

    deleteButton.title =
        "Delete task";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(task.id);

        }
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    /* Final structure */

    article.appendChild(checkbox);

    article.appendChild(content);

    article.appendChild(actions);


    return article;

}


/* ================= TOGGLE TASK ================= */

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* ================= EDIT TASK ================= */

function editTask(id) {

    const task =
        tasks.find(function (task) {

            return task.id === id;

        });


    if (!task) return;


    taskInput.value =
        task.title;


    editingTaskId =
        id;


    taskForm.querySelector(
        ".add-btn"
    ).textContent =
        "✓ Update Task";


    taskInput.focus();

}


/* ================= DELETE TASK ================= */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    renderTasks();

    updateStatistics();

}


/* ================= FILTER ================= */

filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {


            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            renderTasks();

        }
    );

});


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    function () {

        renderTasks();

    }
);


/* ================= CLEAR COMPLETED ================= */

clearCompleted.addEventListener(
    "click",
    function () {


        const completedCount =
            tasks.filter(
                task => task.completed
            ).length;


        if (completedCount === 0) {

            alert(
                "There are no completed tasks."
            );

            return;

        }


        const confirmed =
            confirm(
                `Delete ${completedCount} completed task(s)?`
            );


        if (!confirmed) return;


        tasks =
            tasks.filter(
                task => !task.completed
            );


        saveTasks();

        renderTasks();

        updateStatistics();

    }
);


/* ================= STATISTICS ================= */

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    pendingTasks.textContent =
        pending;


    completedTasks.textContent =
        completed;


    /* Progress */

    const progress =
        total === 0

            ? 0

            : Math.round(
                (completed / total) * 100
            );


    progressText.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;

}


/* ================= FORMAT DATE ================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        undefined,
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ================= CAPITALIZE ================= */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +
           text.slice(1);

}


/* ================= DARK MODE ================= */

const savedTheme =
    localStorage.getItem("taskTheme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const darkMode =
            document.body.classList.contains(
                "dark"
            );


        themeToggle.textContent =
            darkMode ? "☀️" : "🌙";


        localStorage.setItem(
            "taskTheme",
            darkMode ? "dark" : "light"
        );

    }
);


/* ================= KEYBOARD SUPPORT ================= */

document.addEventListener(
    "keydown",
    function (event) {


        /* Focus task input */

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            taskInput.focus();

        }


        /* Escape editing */

        if (
            event.key === "Escape" &&
            editingTaskId !== null
        ) {

            editingTaskId = null;

            taskInput.value = "";

            taskForm.querySelector(
                ".add-btn"
            ).textContent =
                "+ Add Task";

        }

    }
);


/* ================= INITIAL LOAD ================= */

renderTasks();

updateStatistics();