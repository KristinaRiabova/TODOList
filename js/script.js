//I have two dates, first date is when task was created and second will change if you edit a task.
//button ClearStorage will work when you reload a page
//when you click a button (pick todo to do right now) it will choose one of the tasks and also the name of the active task will be written above
// when you remove something it will not be displayed again after the page reloads
//time is sorted by millisecond

document.addEventListener('DOMContentLoaded', function () {

    class TodoItem {
        constructor(taskText, date) {
            this.taskText = taskText;
            this.date = date;
        }

        createTaskElement() {
            const taskItem = document.createElement('li');
            const taskCheckbox = document.createElement('input');
            const taskTextElement = document.createElement('span');
            const taskRemoveButton = document.createElement('button');
            const taskCreatedAt = document.createElement('span');
            const taskUpdatedAt = document.createElement('span');

            taskCheckbox.type = 'checkbox';
            taskTextElement.textContent = this.taskText;
            taskRemoveButton.textContent = 'Remove';
            taskCreatedAt.textContent = this.formatDate(this.date);
            taskUpdatedAt.textContent = this.formatDate(this.date);

            taskCreatedAt.classList.add('task-created-at');

            taskItem.appendChild(taskCheckbox);
            taskItem.appendChild(taskTextElement);
            taskItem.appendChild(taskRemoveButton);
            taskItem.appendChild(taskCreatedAt);
            taskItem.appendChild(taskUpdatedAt);

            pickRandomTodoButton.addEventListener('click', pickRandomTodo);
            taskCheckbox.addEventListener('change', this.toggleTaskStatus.bind(this));
            taskRemoveButton.addEventListener('click', this.removeTask.bind(this));
            taskTextElement.addEventListener('dblclick', this.startEditing.bind(this));
            

            return taskItem;
        }

        toggleTaskStatus(event) {
            const taskItem = event.target.parentElement;
            const isCompleted = taskItem.classList.contains('completed');
        
            if (!isCompleted) {
                taskItem.classList.add('completed');
            } else {
                taskItem.classList.remove('completed');
            }
        
            saveToLocalStorage();
        }
        
        

        removeTask(event) {
            const taskItem = event.target.parentElement;
            taskItem.remove();
            saveToLocalStorage();
        }

        startEditing(event) {
            if (editingTask) {
                
                this.cancelEditing();
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
                    this.finishEditing(taskItem, inputField);
                } else if (e.key === 'Escape') {
                    this.cancelEditing();
                }
            }.bind(this));

            inputField.focus();
            editingTask = taskItem;
        }

        finishEditing(taskItem, inputField) {
            const taskTextElement = taskItem.querySelector('span');
            taskTextElement.textContent = inputField.value;
            const taskCreatedAt = taskItem.querySelector('.task-created-at');
            taskCreatedAt.textContent = this.formatDate(new Date());
            inputField.remove();
            editingTask = null;
            saveToLocalStorage();
        }

        cancelEditing() {
            if (!editingTask) return;

            const taskTextElement = editingTask.querySelector('span');
            const inputField = editingTask.querySelector('input');
            taskTextElement.textContent = inputField.value;
            inputField.remove();
            editingTask = null;
        }

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
        }

    }

    class TodoItemPremium extends TodoItem {
        constructor(taskText, date, imageUrl) {
            super(taskText, date);
            this.imageUrl = imageUrl;
        }

        createTaskElement() {
            const taskItem = super.createTaskElement();

            
            const taskImage = document.createElement('img');
            taskImage.src = this.imageUrl;
            taskImage.alt = 'free-icon-font-star-3916582.png'; 
            taskItem.appendChild(taskImage);

            return taskItem;
             
        }
        
    }

    const taskList = document.getElementById('taskList');
    const newTaskInput = document.getElementById('newTask');
    const addButton = document.getElementById('addButton');
    const removeCompletedButton = document.getElementById('removeCompleted');
    const removeAllButton = document.getElementById('removeAll');
    const sortAscendingButton = document.getElementById('sortAscending');
    const sortDescendingButton = document.getElementById('sortDescending');
    const pickRandomTodoButton = document.getElementById('pickRandomTodoButton');
    let editingTask = null;

    function pickRandomTodo() {
        const todoItems = Array.from(taskList.children);
        const randomIndex = Math.floor(Math.random() * todoItems.length);
    
        
        todoItems.forEach(item => item.classList.remove('active'));
    
        
        const selectedTask = todoItems[randomIndex];
        selectedTask.classList.add('active');
    
        
        const activeTaskElement = document.getElementById('activeTask');
        activeTaskElement.textContent = `Active Task: ${selectedTask.querySelector('span').textContent}`;
    }

    function saveToLocalStorage() {
        const tasks = Array.from(taskList.children).map(taskItem => {
            return {
                taskText: taskItem.querySelector('span').textContent,
                date: taskItem.querySelector('.task-created-at').textContent,
                completed: taskItem.classList.contains('completed'),
                imageUrl: taskItem.querySelector('img').src
            };
        });
        localStorage.setItem('todoList', JSON.stringify(tasks));
    }
    
    function loadFromLocalStorage() {
        const savedTasks = localStorage.getItem('todoList');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(savedTask => {
                const taskItem = new TodoItemPremium(savedTask.taskText, new Date(savedTask.date), savedTask.imageUrl).createTaskElement();
                if (savedTask.completed) {
                    taskItem.classList.add('completed');
                }
                taskList.appendChild(taskItem);
            });
        }
    }
    function saveSortingOrder(order) {
        localStorage.setItem('sortingOrder', order);
    }

    
    function loadSortingOrder() {
        return localStorage.getItem('sortingOrder') || 'asc'; 
    }

    
    function clearLocalStorage() {
        localStorage.removeItem('todoList');
        localStorage.removeItem('sortingOrder');
    }

    function sortAscending() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const dateA = new Date(a.querySelector('.task-created-at').textContent);
            const dateB = new Date(b.querySelector('.task-created-at').textContent);
            return dateA - dateB;
        });
        taskList.innerHTML = '';
        tasks.forEach(task => taskList.appendChild(task));
        saveSortingOrder('asc'); 
        saveToLocalStorage(); 
    }
    
    function sortDescending() {
        const tasks = Array.from(taskList.children);
        tasks.sort((a, b) => {
            const dateA = new Date(a.querySelector('.task-created-at').textContent);
            const dateB = new Date(b.querySelector('.task-created-at').textContent);
            return dateB - dateA;
        });
        taskList.innerHTML = '';
        tasks.forEach(task => taskList.appendChild(task));
        saveSortingOrder('desc'); 
        saveToLocalStorage(); 
    }
    

    function addTask() {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') return;

        const imageUrl = 'free-icon-font-star-3916582.png';
        const premiumTaskItem = new TodoItemPremium(taskText, new Date(), imageUrl).createTaskElement();
        taskList.prepend(premiumTaskItem);
        newTaskInput.value = '';
        saveToLocalStorage();
    }

    function removeCompleted() {
        const completedTasks = document.querySelectorAll('.completed');
        
        completedTasks.forEach(task => {
            task.remove();
        });
    
        saveToLocalStorage();
    }
    
    
    
    

    function removeAll() {
        const taskCount = taskList.children.length;
        if (taskCount === 0) return;

        const confirmation = window.confirm('Remove all tasks?');
        if (confirmation) {
            taskList.innerHTML = '';
        }
        saveToLocalStorage();
    }
    const clearStorageButton = document.getElementById('clearStorage');
    clearStorageButton.addEventListener('click', function () {
        clearLocalStorage();
        
    });

    document.getElementById('newTask').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    addButton.addEventListener('click', addTask);
    removeCompletedButton.addEventListener('click', removeCompleted);
    removeAllButton.addEventListener('click', removeAll);
    sortAscendingButton.addEventListener('click', sortAscending);
    sortDescendingButton.addEventListener('click', sortDescending);
    


    loadFromLocalStorage();

});