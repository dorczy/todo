'use strict';
                                                  
(function() {
                                                  
    const now = new Date();
    const dayName = [...document.querySelectorAll('.dayName')];
    const dayNameOptions = {
        weekday: 'long',
    };
                                                  
    const settingDayName = () => {
        dayName.forEach( item => 
            item.textContent = now.toLocaleDateString('en-US', dayNameOptions) );
    };
                                                  
    const date = [...document.querySelectorAll('.date')];
                                                  
    const settingDate = () => {
        date.forEach( item => 
            item.textContent = new Intl.DateTimeFormat('en-US').format(now) );
    };
                                                      
    let todos = [];
                                                  
    const addInput = document.querySelector('.add__input');
    const addBtn = document.querySelector('.add__btn');
    const pendingToDosDiv = document.querySelector('.pendingToDos');
    const pendingNumber = document.querySelector('.pending__number');
    const completedToDosDiv = document.querySelector('.completedToDos');
    const completedPercent = document.querySelector('.completed__percent');

    const pendingItemsNumberRefresh = () => {
        pendingNumber.textContent = pendingToDosDiv.childElementCount;
    };
                                                  
    const hideAndShowBtn = document.querySelector('.btn__showAndHide');
                                                  
    hideAndShowBtn.onclick = () => {
        completedToDosDiv.classList.toggle('hidden');
    };
                                                  
    const clearBtn = document.querySelector('.btn__clearAll');
                                                  
    clearBtn.onclick = () => {
        localStorage.clear();
        pendingToDosDiv.innerHTML = '';
        completedToDosDiv.innerHTML = '';
        pendingItemsNumberRefresh();
        completedTasksPercent();
    };
                                                  
    const completedTasksPercent = () => {
        const allDivs = pendingToDosDiv.childElementCount + completedToDosDiv.childElementCount;
        if (allDivs == 0) {
            return completedPercent.textContent = '0%'
        };
        const calculation = (100 / allDivs * completedToDosDiv.childElementCount).toFixed(0);
        return completedPercent.textContent = calculation + "%";
    };
                                                  
    const ToDoMoving = (event) => {
        const div = event.target.parentElement;
        const labelContent = div.querySelector('label').textContent;

        if(event.target.checked == true) {
            completedToDosDiv.appendChild(div);

            div.classList.remove('pending__items');
            div.classList.add('completed__items');
            
            todos.filter( item => item.text == labelContent ? item.done = true : "");
        };                                                  
        if (event.target.checked == false) {
            pendingToDosDiv.appendChild(div);

            div.classList.remove('completed__items');
            div.classList.add('pending__items');
            
            todos.filter( item => item.text == labelContent ? item.done = false : "");
        };

        localDB.setItem('todos', todos);
        pendingItemsNumberRefresh();
        completedTasksPercent();
    };
                                                  
    const localDB = {
        setItem(key, value) {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        },

        getItem(key) {
            const value = localStorage.getItem(key);
            
            if(!value) {
                return null;
            } else {
                return JSON.parse(value);
            }
        },

        removeItem(key) {
            localStorage.removeItem(key);
        }
    };

    const loadExistingTodos = () => {
        const savedTodos = localDB.getItem('todos');
        if(savedTodos) {
            todos = savedTodos;
        };
                                                  
        todos.forEach(item => {
            if(item.done === false) {
                showTodo(item, 'pending__items', pendingToDosDiv, false);
            } else {
                showTodo(item, 'completed__items', completedToDosDiv, true);
            }
        });
    };
                                                  
    const init = () => {
        settingDayName();
        settingDate();
        setListeners();
        loadExistingTodos();
        pendingItemsNumberRefresh();
        completedTasksPercent();
    };

    const setListeners = () => {
        addBtn.addEventListener('click', addNewToDo);
    };
                                                      
    const addNewToDo = () => {
        const value = addInput.value;
        if(value === '') {
            alert('Enter the task!')
            return;
        };

        const todo = {
            text: value,
            done: false,
        };

        todos.push(todo);
        localDB.setItem('todos', todos);
        showTodo(todo, 'pending__items', pendingToDosDiv, false);

        addInput.value = '';

        pendingItemsNumberRefresh();
        completedTasksPercent();
    };
                                                  
    const showTodo = (todo, divClass, divName, isItChecked) => {
        const div = document.createElement('div');

        div.classList.add(divClass);
        divName.appendChild(div);

        div.innerHTML = `
        <input class="checkbox" type="checkbox">
        <label>${todo.text}</label>
        <div class="deleteBtn">
            <i class="fas fa-trash-alt"></i>
        </div>
        `;
                                                  
        div.querySelector('input[type="checkbox"]').checked = isItChecked;
                                                  
        div.addEventListener('mouseover', () => {
            div.lastElementChild.classList.add('deleteBtn--hover');
        });
        div.addEventListener('mouseleave', () => {
            div.lastElementChild.classList.remove('deleteBtn--hover');
        });
                                                  
        div.lastElementChild.addEventListener('click', () => {
            const labelContent = div.querySelector('label').textContent;            
            const index = todos.findIndex( item => item.text == labelContent );
            todos.splice(index, 1);
            localDB.setItem('todos', todos);
            div.remove();
            pendingItemsNumberRefresh();
            completedTasksPercent();
        });
                                                  
        div.firstElementChild.addEventListener('click', ToDoMoving);
    };                                                                   

    init();
})();
