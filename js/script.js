document.addEventListener('DOMContentLoaded', function () {
    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTask');
    const addButton = document.getElementById('addButton');
    const removeCompletedButton = document.getElementById('removeCompleted');
    const removeAllButton = document.getElementById('removeAll');

    let editingTask = null;

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskElement(taskText, new Date());
        taskList.prepend(taskItem);
        newTaskInput.value = '';
    }

    function createTaskElement(taskText, date) {
        const taskItem = document.createElement('li');
        const taskCheckbox = document.createElement('input');
        const taskTextElement = document.createElement('span');
        const taskRemoveButton = document.createElement('button');
        const taskCreatedAt = document.createElement('span');

        taskCheckbox.type = 'checkbox';
        taskTextElement.textContent = taskText;
        taskRemoveButton.textContent = 'Remove';
        taskCreatedAt.textContent = formatDate(date);

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(taskRemoveButton);
        taskItem.appendChild(taskCreatedAt);

        taskCheckbox.addEventListener('change', toggleTaskStatus);
        taskRemoveButton.addEventListener('click', removeTask);
        taskTextElement.addEventListener('dblclick', startEditing);

        return taskItem;
    }

    function toggleTaskStatus(event) {
        const taskItem = event.target.parentElement;
        taskItem.classList.toggle('completed');
    }

    function removeTask(event) {
        const taskItem = event.target.parentElement;
        taskItem.remove();
    }

    function startEditing(event) {
        if (editingTask) {
            // Cancel editing of the previous task
            cancelEditing();
        }

        const taskItem = event.target.parentElement;
        const taskTextElement = taskItem.querySelector('span');
        const taskText = taskTextElement.textContent;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = taskText;

        taskTextElement.textContent = '';
        taskTextElement.appendChild(inputField);

        inputField.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                finishEditing(taskItem, inputField);
            } else if (e.key === 'Escape') {
                cancelEditing();
            }
        });

        inputField.focus();
        editingTask = taskItem;
    }

    function finishEditing(taskItem, inputField) {
        const taskTextElement = taskItem.querySelector('span');
        taskTextElement.textContent = inputField.value;
        const taskCreatedAt = taskItem.querySelector('.task-created-at');
        taskCreatedAt.textContent = formatDate(new Date());
        inputField.remove();
        editingTask = null;
    }

    function cancelEditing() {
        if (!editingTask) return;

        const taskTextElement = editingTask.querySelector('span');
        const inputField = editingTask.querySelector('input');
        taskTextElement.textContent = inputField.value;
        inputField.remove();
        editingTask = null;
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    function removeCompleted() {
        const completedTasks = document.querySelectorAll('.completed');
        completedTasks.forEach(task => task.remove());
    }

    function removeAll() {
        const taskCount = taskList.children.length;
        if (taskCount === 0) return;

        const confirmation = window.confirm('Remove all tasks?');
        if (confirmation) {
            taskList.innerHTML = '';
        }
    }

    document.getElementById('newTask').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    addButton.addEventListener('click', addTask);
    removeCompletedButton.addEventListener('click', removeCompleted);
    removeAllButton.addEventListener('click', removeAll);
});



