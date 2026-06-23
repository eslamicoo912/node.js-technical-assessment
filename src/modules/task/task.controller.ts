import { Request, Response } from 'express';
import { TaskService } from './task.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { ITaskFilters } from './task.interfaces';
import { QueryFeatures } from '../../shared/utils/query-features';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { projectId } = req.params;

    const task = await this.taskService.createTask(userId, projectId as string, req.body);
    res.status(201).json({ status: 'success', data: task });
  });

  getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { projectId } = req.params;

    const options = QueryFeatures.parse(req.query as Record<string, string>, 'createdAt');

    const filters: ITaskFilters = {
      status: req.query.status as ITaskFilters['status'],
      priority: req.query.priority as ITaskFilters['priority'],
    };

    const tasks = await this.taskService.getTasks(userId, projectId as string, filters, options);
    res.status(200).json({ status: 'success', results: tasks.length, data: tasks });
  });

  getOne = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await this.taskService.getTaskById(userId, id as string);
    res.status(200).json({ status: 'success', data: task });
  });

  update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    const task = await this.taskService.updateTask(userId, id as string, req.body);
    res.status(200).json({ status: 'success', data: task });
  });

  delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await this.taskService.deleteTask(userId, id as string);
    res.status(204).json({ status: 'success', data: null });
  });
}