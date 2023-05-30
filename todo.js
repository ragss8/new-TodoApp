// functionalities to be added are: editing a task , render the task and many more.

  // Get references
  const taskInput = document.getElementById('taskInput');
  const addButton = document.getElementById('addButton');
  const taskDisplay = document.getElementById('taskDisplay');

  // Define an array to store tasks
  const taskList = [];

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

    // Check if the task ID already exists
    const existingTask = taskList.find(task => task.id === taskId);
    if (existingTask) {
      console.log('Task already exists');
      return;
    }

    // Create a new task object
    const task = {
      id: taskList.length, // Use the index as the ID
      status: 'pending',
      title: taskTitle
    };

    // Push the task object to the task list
    taskList.push(task);

    // Clear the task input field
    taskInput.value = '';

    // Update the task display
    updateTaskDisplay();
  }

    // Function to update the task display
    function updateTaskDisplay() {
        // Clear the current task display
        taskDisplay.innerHTML = '';
    
        // Loop through the task list and create the task items
        for (const task of taskList) {
          // Create a new list item for the task
          const listItem = document.createElement('li');
    
          // Set the task item text
          listItem.textContent = `Task ID: ${task.id}, Status: ${task.status}, Title: ${task.title}`;
    
          //create delButton for the task
          const delButton = document.createElement('button');
          delButton.textContent = 'Delete';
          delButton.addEventListener('click' , () => deleteTask(task.id)); // call function for delButton
    
          // Append the delButton to taskList
          listItem.appendChild(delButton);
    
          // Append the task item to the task display
          taskDisplay.appendChild(listItem);
        }
      }

      // Function to delete a task from the task list
function deleteTask(taskId) {
    // Find the index of the task with the given ID
    const taskIndex = taskList.findIndex(task => task.id === taskId);
  
    // Check if the task exists
    if (taskIndex === -1) {
      console.log('Task not found');
      return;
    }
  
    // Remove the task from the taskList array
    taskList.splice(taskIndex, 1);
  
    // Update the task display
    updateTaskDisplay();
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

