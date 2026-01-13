// Version number
export const VERSION = '3.5.1';

// Configurable debug mode - set to false for production
export const DEBUG = true;

// Todo sorting modes for display order configuration
export const TodoSortMode = {
  NONE: 'none',
  ALPHA_ASC: 'alpha_asc',
  ALPHA_DESC: 'alpha_desc',
  DUEDATE_ASC: 'duedate_asc',
  DUEDATE_DESC: 'duedate_desc'
};

export const TodoListEntityFeature = {
  CREATE_TODO_ITEM: 1,
  DELETE_TODO_ITEM: 2,
  UPDATE_TODO_ITEM: 4,
  MOVE_TODO_ITEM: 8,
  SET_DUE_DATE_ON_ITEM: 16,
  SET_DUE_DATETIME_ON_ITEM: 32,
  SET_DESCRIPTION_ON_ITEM: 64
};
