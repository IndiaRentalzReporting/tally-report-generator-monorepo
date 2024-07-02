export interface Action {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: 'Create' | 'Read' | 'Update' | 'Delete';
}
