import { TaskModel } from '../../database/models/task.model';
import { IPaginationOptions } from '../../shared/interfaces/query';
import { ITask, ITaskFilters } from './task.interfaces';

export class TaskRepository {
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const newTask = new TaskModel(taskData);
    return await newTask.save();
  }

  async findAll(projectId: string, filters: ITaskFilters, options: IPaginationOptions): Promise<ITask[]> {
    const query: Record<string, string> = { projectId };

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }

    const page = options.page || 1;
    const limit = options.limit || 10;

    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

    return await TaskModel.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findById(id: string): Promise<ITask | null> {
    return await TaskModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<ITask>): Promise<ITask | null> {
    return await TaskModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async delete(id: string): Promise<ITask | null> {
    return await TaskModel.findByIdAndDelete(id).exec();
  }
}