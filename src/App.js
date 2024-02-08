import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineCheck, AiOutlineDelete } from 'react-icons/ai';

function App() {
  const [allTodos, setAllTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    let savedTodos = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedToDos = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodos) {
      setAllTodos(savedTodos);
    }

    if (savedCompletedToDos) {
      setCompletedTodos(savedCompletedToDos);
    }
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    if (selectedFilter === 'all') {
      setIsCompletedScreen(false);
    } else if (selectedFilter === 'completed') {
      setIsCompletedScreen(true);
    } else if (selectedFilter === 'incomplete') {
      setIsCompletedScreen(false);
    }
  };

  const handleAddNewToDo = () => {
    let newToDoObj = {
      title: newTodoTitle,
      description: newDescription,
      dueDate: newDueDate 
    };
    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newToDoObj);
    setAllTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewDescription('');
    setNewTodoTitle('');
    setNewDueDate('');
  };

  const handleToDoDelete = (index) => {
    let reducedTodos = [...allTodos];
    reducedTodos.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodos));
    setAllTodos(reducedTodos);
  };

  const handleCompletedTodoDelete = (index) => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice(index, 1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedCompletedTodos));
    setCompletedTodos(reducedCompletedTodos);
  };

  const handleComplete = (index) => {
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var minutes = date.getMinutes();
    var ss = date.getSeconds();
    var finalDate = dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    let filteredTodo = {
      ...allTodos[index],
      completedOn: finalDate,
    };

    let updatedCompletedList = [...completedTodos, filteredTodo];
    setCompletedTodos(updatedCompletedList);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedList));

    handleToDoDelete(index);
  };

  const handleTaskEdit = (index, updatedTitle, updatedDescription, updatedDueDate) => {
    let updatedTodoArr = [...allTodos];
    updatedTodoArr[index].title = updatedTitle;
    updatedTodoArr[index].description = updatedDescription;
    updatedTodoArr[index].dueDate = updatedDueDate; 
    setAllTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  const handleSortByChange = (selectedSortBy) => {
    setSortBy(selectedSortBy);
  };

  const filteredTodos = isCompletedScreen
    ? completedTodos
    : allTodos.filter(todo => !completedTodos.some(completedTodo => completedTodo.title === todo.title));

  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.completedOn || '') - new Date(b.completedOn || '');
    } else if (sortBy === 'priority') {
      
    }
    return 0;
  });

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label><strong>Title:</strong></label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label><strong>Description:</strong></label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label><strong>Due Date:</strong></label> 
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${filter === 'all' && 'active'}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button
            className={`secondaryBtn ${filter === 'completed' && 'active'}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
          <button
            className={`secondaryBtn ${filter === 'incomplete' && 'active'}`}
            onClick={() => handleFilterChange('incomplete')}
          >
            Incomplete
          </button>
          <select
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
        <div className="todo-list">
          {sortedTodos.map((item, index) => (
            <div className="todo-list-item" key={index}>
              <div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleTaskEdit(index, e.target.value, item.description, item.dueDate)}
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleTaskEdit(index, item.title, e.target.value, item.dueDate)}
                />
                {isCompletedScreen && <p><i>Completed at: {item.completedOn}</i></p>}
                {!isCompletedScreen && <p><i>Due Date: {item.dueDate}</i></p>} 
              </div>
              <div>
                {isCompletedScreen ? (
                  <AiOutlineDelete
                    className="icon delete-icon"
                    onClick={() => handleCompletedTodoDelete(index)}
                  />
                ) : (
                  <>
                    <AiOutlineCheck
                      className="icon check-icon"
                      onClick={() => handleComplete(index)}
                    />
                    <AiOutlineDelete
                      className="icon delete-icon"
                      onClick={() => handleToDoDelete(index)}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
