
import { KanbanBoard, User } from '@/types/kanban';

// Keys for localStorage
const USERS_KEY = 'kanban_users';
const CURRENT_USER_KEY = 'kanban_current_user';

// Helper to handle dates when parsing JSON
const dateReviver = (_key: string, value: any) => {
  if (typeof value === 'string') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (dateRegex.test(value)) {
      return new Date(value);
    }
  }
  return value;
};

// User-related functions
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];
  return JSON.parse(usersJson, dateReviver);
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const createUser = (username: string, password: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password, // Note: In a real app, never store plain text passwords
    boards: []
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const authenticateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  }
  return null;
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) return null;
  
  const user = getUserById(userId);
  return user || null;
};

// Board-related functions
export const saveBoard = (board: KanbanBoard): void => {
  const users = getUsers();
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  
  if (!currentUserId) return;
  
  const userIndex = users.findIndex(u => u.id === currentUserId);
  if (userIndex === -1) return;
  
  const boardIndex = users[userIndex].boards.findIndex(b => b.id === board.id);
  
  if (boardIndex !== -1) {
    // Update existing board
    users[userIndex].boards[boardIndex] = board;
  } else {
    // Add new board
    const newBoard = {
      ...board,
      userId: currentUserId
    };
    users[userIndex].boards.push(newBoard);
  }
  
  saveUsers(users);
};

export const getUserBoards = (): KanbanBoard[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  return currentUser.boards;
};

export const getBoardById = (boardId: string): KanbanBoard | undefined => {
  const currentUser = getCurrentUser();
  if (!currentUser) return undefined;
  return currentUser.boards.find(board => board.id === boardId);
};