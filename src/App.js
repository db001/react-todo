import React, { Component } from 'react';
import './App.css';
import db from './mockDB';

const toArray = obj => Object.keys(obj).map(key => ({...obj[key], id: key}));
const sortByTs = todos => toArray(todos).sort((a, b) => b.ts - a.ts);

class App extends Component {
  state = {
    todos: {},
    todoList: [],
    loaded: false,
    newTitle: ''
  };

  actions = {
    changeInputTitle: title => {
      this.setState({
        newTitle: title
      });
    },
    submit: () => {
      db.addTodo({
        title: this.state.newTitle
      });
      this.setState({
        newTitle: ''
      });
    },
    syncTodos: () => {
      db.syncTodos(todos => {
        this.setState({
          todos,
          loaded: true,
          todoList: Object.keys(todos)
            .map(key => ({
              ...todos[key],
              id: key
            }))
            .sort((a, b) => b.ts - a.ts)
        });
      });
    }
  };

  componentDidMount() {
    this.actions.syncTodos();
  }

  render() {
    console.log(this.state);
    if(!this.state.loaded) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>Todos</h1>
        <Form {...this.state} {...this.actions} />
        <Todos {...this.state} />
      </div>
    );
  }
}

const Form = props => (
    <form
      onSubmit={e => {
        e.preventDefault();
        props.submit();
      }}
    >
      <input
        type="text"
        value={props.newTitle}
        onChange={e => {
          props.changeInputTitle(e.target.value);
        }}
      />
      <button disabled={!props.newTitle}>Submit</button>
    </form>
  );

const Todos = props => {
  return (
    <div>
      {props.todoList.map(todo => <div key={todo.id}>{todo.title}</div>)}
    </div>
  );
};

export default App;
