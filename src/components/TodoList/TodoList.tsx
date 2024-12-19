import { useState } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  filteredTodos: Todo[];
  onRemoveTodo: (todoId: number) => Promise<void>;
  onUpdateTodo: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  onRemoveTodo,
  onUpdateTodo,
  loadingTodoIds,
  tempTodo,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          isLoading={loadingTodoIds.includes(todo.id)}
          isInEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};
