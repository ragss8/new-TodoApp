// Get references
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskDisplay = document.getElementById('taskDisplay');

// Define an array to store tasks
const taskList = [];
let editingIndex = -1; // Track the index of the task being edited

// Function to generate a hash 
function generateHash(string) {
  return sha256(string);
}

// Function to add task to the list
function addTask() {
  // Retrieve the task input value
  const taskTitle = taskInput.value.trim();

  // Generate a hash ID for the task
  const taskId = generateHash(taskTitle);

  // Create a new task object
  const task = {
    id: taskId,
    status: 'pending',
    title: taskTitle
  };

  // Push the task object to the task list
  taskList.push(task);

  // Clear the task input field
  taskInput.value = '';

  // Reset the editing index
  editingIndex = -1;

  // Update the task display
  updateTaskDisplay();
}

// Function to delete a task from the task list
function deleteTask(index) {
  // Remove the task from the taskList array
  taskList.splice(index, 1);

  // If the deleted task was the one being edited, reset the editing index
  if (editingIndex === index) {
    editingIndex = -1;
  }

  // Update the task display
  updateTaskDisplay();
}

// Function to update the status of a task
function updateTaskStatus(index, isChecked) {
  // Update the task status based on the checkbox state
  taskList[index].status = isChecked ? 'completed' : 'pending';

  // Update the task display
  updateTaskDisplay();
}

// Function to handle task title edit
function editTask(index) {
  // Set the editing index to the current task index
  editingIndex = index;

  // Find the task with the given index
  const task = taskList[index];

  // Create an input element for editing the task title
  const taskTitleInput = document.createElement('input');
  taskTitleInput.type = 'text';
  taskTitleInput.value = task.title;

  // Replace the task title span with the task title input
  const taskTitleSpan = document.getElementById(`taskTitle_${index}`);
  taskTitleSpan.textContent = '';
  taskTitleSpan.appendChild(taskTitleInput);

  // Focus on the task title input
  taskTitleInput.focus();

  // Update the task title when the Enter key is pressed
  taskTitleInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const updatedTaskTitle = taskTitleInput.value.trim();
      if (updatedTaskTitle !== '') {
        task.title = updatedTaskTitle;
        editingIndex = -1; // Reset the editing index
        updateTaskDisplay();
      }
    }
  });

  // Revert back to displaying the task title span when the input loses focus
  taskTitleInput.addEventListener('blur', () => {
    if (editingIndex === index) {
      // If the editing index is still the same, revert back to displaying the task title
      taskTitleSpan.textContent = task.title;
      editingIndex = -1; // Reset the editing index
    }
  });
}

// Function to update the task display
function updateTaskDisplay() {
  // Clear the current task display
  taskDisplay.innerHTML = '';

  // Loop through the task list and create the task items
  for (let i = 0; i < taskList.length; i++) {
    const task = taskList[i];

    // Create a new list item for the task
    const listItem = document.createElement('li');

    // Highlight the task item if it is being edited
    if (i === editingIndex) {
      listItem.classList.add('highlight'); // Add a CSS class for highlighting
    }

    // Create a checkbox for the task
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.status === 'completed'; // Set the checked state based on the task status
    checkbox.addEventListener('change', () => updateTaskStatus(i, checkbox.checked)); // Call updateTaskStatus function when checked state changes

    // Append the checkbox to the task item
    listItem.appendChild(checkbox);

    // Create a span element for the task title
    const taskTitleSpan = document.createElement('span');
    taskTitleSpan.id = `taskTitle_${i}`;
    taskTitleSpan.textContent = `Task ID: ${i}, Status: ${task.status}, Title: ${task.title}`;
    taskTitleSpan.addEventListener('click', () => editTask(i)); // Call editTask function when clicked

    // Append the task title span to the task item
    listItem.appendChild(taskTitleSpan);

    // Create a delete button for the task
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(i)); // Call deleteTask function when clicked

    // Append the delete button to the task item
    listItem.appendChild(deleteButton);

    // Append the task item to the task display
    taskDisplay.appendChild(listItem);
  }
}

// Function to handle keydown event
function handleKeyDown(event) {
  if (event.key === 'Enter') {
    addTask();
  }
}

// Add event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', handleKeyDown);

// Update the initial task display
updateTaskDisplay();
