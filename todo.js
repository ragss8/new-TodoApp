//the task management functionality is encapsulated within the TaskManager class, providing a cleaner and more structured approach to managing tasks. 
//The DOM selection is done using querySelector, and the code is organized into separate functions for different tasks.

// Define an object to manage tasks
class TaskManager {
  constructor() {
    this.taskList = [];
    this.editingIndex = -1;
  }

  generateHash(string) {
    return sha256(string);
  }
//function to add a task
  addTask(taskTitle) {
    const trimmedTitle = taskTitle.trim();
    if (trimmedTitle === '') {
      return;
    }

    const taskId = this.generateHash(trimmedTitle);
    const task = {
      id: taskId,
      status: 'pending',
      title: trimmedTitle,
    };

    this.taskList.push(task);
    this.updateTaskDisplay();
  }
//function to delete a task
  deleteTask(index) {
    this.taskList.splice(index, 1);
    if (this.editingIndex === index) {
      this.editingIndex = -1;
    }
    this.updateTaskDisplay();
  }
//function to update the task on being checked
  updateTaskStatus(index, isChecked) {
    this.taskList[index].status = isChecked ? 'completed' : 'pending';
    this.updateTaskDisplay();
  }
//function to edit the task based on the index criterion 
  editTask(index) {
    this.editingIndex = index;
    const task = this.taskList[index];

    const taskTitleSpan = document.querySelector(`#taskTitle_${index}`);
    taskTitleSpan.innerHTML = `<input type="text" value="${task.title}" />`;

    const taskTitleInput = taskTitleSpan.querySelector('input');
    taskTitleInput.focus();

    taskTitleInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const updatedTaskTitle = taskTitleInput.value.trim();
        if (updatedTaskTitle !== '') {
          task.title = updatedTaskTitle;
          this.editingIndex = -1;
          this.updateTaskDisplay();
        }
      }
    });
    // Revert back to displaying the task title span when the input loses focus
    taskTitleInput.addEventListener('blur', () => {
      if (this.editingIndex === index) {
        taskTitleSpan.textContent = task.title;
        this.editingIndex = -1;
      }
    });
  }
// this is the function to render the changes on the html page
  updateTaskDisplay() {
    const taskDisplay = document.querySelector('#taskDisplay');
    //clear the current task display
    taskDisplay.innerHTML = '';

    for (let i = 0; i < this.taskList.length; i++) {
      const task = this.taskList[i];
      const listItem = document.createElement('li');

      if (i === this.editingIndex) {
        listItem.classList.add('highlight');
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.status === 'completed';
      checkbox.addEventListener('change', () =>
        this.updateTaskStatus(i, checkbox.checked)
      );

      listItem.appendChild(checkbox);

      const taskTitleSpan = document.createElement('span');
      taskTitleSpan.id = `taskTitle_${i}`;
      taskTitleSpan.textContent = `Task ID: ${i}, Status: ${task.status}, Title: ${task.title}`;
      taskTitleSpan.addEventListener('click', () => this.editTask(i));

      listItem.appendChild(taskTitleSpan);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => this.deleteTask(i));

      listItem.appendChild(deleteButton);
      taskDisplay.appendChild(listItem);
    }
  }
}

// Create a new instance of TaskManager
const taskManager = new TaskManager();

// Get DOM elements using querySelector
const taskInput = document.querySelector('#taskInput');
const addButton = document.querySelector('#addButton');

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    taskManager.addTask(taskInput.value);
    taskInput.value = '';
  }
}

// Add event listeners
addButton.addEventListener('click', () => {
  taskManager.addTask(taskInput.value);
  taskInput.value = '';
});

taskInput.addEventListener('keydown', handleKeyDown);

// Update the initial task display
taskManager.updateTaskDisplay();
