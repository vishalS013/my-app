import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, List, Dialog, DialogActions, DialogContent, DialogTitle, AppBar, Toolbar, Box } from '@mui/material';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sorted, setSorted] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoTitle, setEditTodoTitle] = useState('');
  const [viewTodo, setViewTodo] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      });
  }, []);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = () => {
    setTodos(todos.map(todo => (todo.id === editTodoId ? { ...todo, title: editTodoTitle } : todo)));
    setOpenEditDialog(false);
    setEditTodoId(null);
    setEditTodoTitle('');
  };

  const toggleSort = () => {
    setSorted(!sorted);
    setTodos([...todos].sort((a, b) => sorted ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
  };  

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const filteredTodos = todos.filter(todo =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todotoview = todos.find(todo => todo.id === viewTodo);

  return (
    <Container>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Todo App
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 3 }}>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <TodoForm addTodo={addTodo} />
          <TextField
            label="Search Todos"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginLeft:"340px"}}
            
          />
          <Button variant="contained" color="warning" onClick={toggleSort}>
            {sorted ? 'Sort Descending' : 'Sort Ascending'}
          </Button>
          
        </Box>

        <Typography variant="h4" gutterBottom align='center'>
         Todos
        </Typography>


        <div>

      <List>
        <Typography variant="h5" sx={{ marginLeft:"30px" ,marginTop:'5px'}}>Description</Typography>
        <Typography variant="h5" sx={{ textAlign: 'right',marginRight:"5px" }}> Actions</Typography>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            setOpenEditDialog={setOpenEditDialog}
            setEditTodoId={setEditTodoId}
            setEditTodoTitle={setEditTodoTitle}
            setViewTodo={setViewTodo}
            toggleComplete={toggleComplete}
          />
        ))}
      </List>
    </div>
      </Box>

      {/* View Todo Dialog */}
      <Dialog open={viewTodo !== null} onClose={() => setViewTodo(null)}>
        <DialogTitle>View Todo</DialogTitle>
        <DialogContent>
          {todotoview ? (
            <>
              <TextField
                label="Todo Title"
                variant="outlined"
                fullWidth
                style={{marginTop:'15px'}}
                value={todotoview.title}
                disabled
              />
              <TextField
                label="Completed"
                variant="outlined"
                fullWidth
                value={todotoview.completed ? 'Yes' : 'No'}
                disabled
                sx={{ mt: 2 }}
              />
            </>
          ) : (
     null
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTodo(null)} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Todo Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Todo Title"
            variant="outlined"
            fullWidth
            value={editTodoTitle}
            onChange={(e) => setEditTodoTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleEditTodo} color="success">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
