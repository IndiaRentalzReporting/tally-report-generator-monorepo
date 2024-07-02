import services from '@/services';

export interface Module {
  name: string;
  icon: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
}
