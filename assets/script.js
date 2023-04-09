window.addEventListener("load", () => {
  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  const toggleModeBtn = document.getElementById("toggle-mode-btn");
  const body = document.body;

  toggleModeBtn.addEventListener("click", function () {
    body.classList.toggle("dark");
  });

  // check for saved tasks on page load
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    const task_el = createTaskElement(task);
    list_el.appendChild(task_el);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = input.value;

    if (!task) {
      // show the modal
      const modal = document.getElementById("custom-modal");
      modal.style.display = "block";

      // add an event listener to the "OK" button
      const closeBtn = document.getElementById("close-modal-btn");
      closeBtn.addEventListener("click", () => {
        // hide the modal
        modal.style.display = "none";
      });

      return;
    }

    const task_el = createTaskElement(task);

    list_el.appendChild(task_el);

    // save task to local storage
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    input.value = "";
  });
  const reset_btn = document.querySelector("#reset-btn");

  reset_btn.addEventListener("click", () => {
    // remove all tasks from list element
    list_el.innerHTML = "";

    // clear tasks from local storage
    localStorage.removeItem("tasks");

    // reset input value
    input.value = "";
  });

  // function to create task element
  function createTaskElement(task) {
    const task_el = document.createElement("div");
    task_el.classList.add("task");

    const task_content_el = document.createElement("div");
    task_content_el.classList.add("content");

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement("input");
    task_input_el.classList.add("text");
    task_input_el.type = "text";
    task_input_el.value = task;
    task_input_el.setAttribute("readonly", "readonly");

    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement("div");
    task_actions_el.classList.add("actions");

    const task_edit_el = document.createElement("button");
    task_edit_el.classList.add("edit");
    task_edit_el.innerHTML = "Edit";

    const task_delete_el = document.createElement("button");
    task_delete_el.classList.add("delete");
    task_delete_el.innerHTML = "Delete";

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    // add event listeners for edit and delete buttons
    task_edit_el.addEventListener("click", () => {
      if (task_edit_el.innerText.toLowerCase() == "edit") {
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
        task_edit_el.innerText = "Save";
      } else {
        task_input_el.setAttribute("readonly", "readonly");
        task_edit_el.innerText = "Edit";
      }

      // update saved task in local storage
      const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const index = savedTasks.indexOf(task);
      if (index > -1) {
        savedTasks[index] = task_input_el.value;
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
      }
    });

    task_delete_el.addEventListener("click", () => {
      list_el.removeChild(task_el);

      // remove task from saved tasks in local storage
      const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const index = savedTasks.indexOf(task);
      if (index > -1) {
        savedTasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
      }
      if (savedTasks.length === 0) {
        localStorage.removeItem("tasks");
      }
    });

    return task_el;
  }
});
