import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.Empty);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        setErrorMessage(ErrorType.LoadTodos);
      }
    })();
  }, []);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterStatus.All) {
          return true;
        }

        return filterStatus === FilterStatus.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterStatus],
  );

  const todosCompletedNum = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const areAllTodosCompleated = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const todosActiveNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(ErrorType.AddTodo);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(ErrorType.DeleteTodo);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(ErrorType.UpdateTodo);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      onRemoveTodo(todo.id);
    });
  };

  const onToggleAll = async () => {
    if (todosActiveNum > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        onUpdateTodo({ ...todo, completed: false });
      });
    }
  };

  const inputAddRef = useRef<HTMLInputElement>(null);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={onAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          inputRef={inputAddRef}
          onToggleAll={onToggleAll}
          areAllTodosCompleated={areAllTodosCompleated}
          todosLength={todos.length}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
            />
            <TodoFooter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              todosLeft={todosActiveNum}
              todosCompleted={todosCompletedNum}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
