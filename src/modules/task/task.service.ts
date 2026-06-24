import { TaskRepository } from './task.repository';
import { ProjectRepository } from '../project/project.repository';
import { ITask, ICreateTaskInput, IUpdateTaskInput, ITaskFilters } from './task.interfaces';
import { AppError } from '../../shared/utils/app-error';
import { Types } from 'mongoose';
import { IPaginationOptions } from '../../shared/interfaces/query';
import { TASKS_PRIORITY, TASKS_STATUS } from '../../shared/constants/tasks';

export class TaskService {
  private taskRepository: TaskRepository;
  private projectRepository: ProjectRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.projectRepository = new ProjectRepository();
  }

  // checks project ownership before creating a child task
  async createTask(userId: string, projectId: string, input: ICreateTaskInput): Promise<ITask> {
    const project = await this.projectRepository.findByIdAndUser(projectId, userId);
    if (!project) {
      throw new AppError('Project not found or you do not have permission to add tasks to it', 404);
    }

    return await this.taskRepository.create({
      projectId: new Types.ObjectId(projectId),
      title: input.title,
      description: input.description,
      status: input.status || TASKS_STATUS.PENDING,
      priority: input.priority || TASKS_PRIORITY.MEDIUM,
      dueDate: new Date(input.dueDate),
    });
  }

  async getTasks(userId: string, projectId: string, filters: ITaskFilters, options: IPaginationOptions): Promise<ITask[]> {
    const project = await this.projectRepository.findByIdAndUser(projectId, userId);
    if (!project) {
      throw new AppError('Project not found or you do not have permission to view its tasks', 404);
    }

    return await this.taskRepository.findAll(projectId, filters, options);
  }

  async getTaskById(userId: string, id: string): Promise<ITask> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // check ownership of the parent project
    const project = await this.projectRepository.findByIdAndUser(task.projectId.toString(), userId);
    if (!project) {
      throw new AppError('Access denied to this task', 403);
    }

    return task;
  }

  async updateTask(userId: string, id: string, input: IUpdateTaskInput): Promise<ITask> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await this.projectRepository.findByIdAndUser(task.projectId.toString(), userId);
    if (!project) {
      throw new AppError('Access denied to modify this task', 403);
    }

    const updateData: any = { ...input };
    if (input.dueDate) {
      updateData.dueDate = new Date(input.dueDate);
    }

    const updatedTask = await this.taskRepository.update(id, updateData);
    if (!updatedTask) {
      throw new AppError('Failed to update task', 400);
    }

    return updatedTask;
  }

  async deleteTask(userId: string, id: string): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await this.projectRepository.findByIdAndUser(task.projectId.toString(), userId);
    if (!project) {
      throw new AppError('Access denied to delete this task', 403);
    }

    await this.taskRepository.delete(id);
  }
}