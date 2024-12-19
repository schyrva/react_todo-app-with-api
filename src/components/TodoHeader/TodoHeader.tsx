import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorType } from '../../types/ErrorType';
import cn from 'classnames';

type Props = {
  onAddTodo: (value: string) => Promise<void>;
  setErrorMessage: Dispatch<SetStateAction<ErrorType>>;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement> | null;
  onToggleAll: () => Promise<void>;
  areAllTodosCompleated: boolean;
  todosLength: number;
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  setErrorMessage,
  isInputDisabled,
  inputRef,
  onToggleAll,
  areAllTodosCompleated,
  todosLength,
}) => {
  const [inputValue, setInputValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setErrorMessage(ErrorType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(trimmedValue);
      setInputValue('');
    } catch {}
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todosLength, inputRef]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [isInputDisabled, inputRef]);

  return (
    <header className="todoapp__header">
      {todosLength !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleated,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
