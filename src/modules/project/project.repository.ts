import { ProjectModel } from '../../database/models/project.model';
import { IPaginationOptions } from '../../shared/interfaces/query';
import { IProject } from './project.interfaces';

export class ProjectRepository {
  async create(projectData: Partial<IProject>): Promise<IProject> {
    const newProject = new ProjectModel(projectData);
    return await newProject.save();
  }

  async findAllByUserId(userId: string, options: IPaginationOptions): Promise<IProject[]> {
    const page = options.page || 1;
    const limit = options.limit || 10;

    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

    return await ProjectModel.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findByIdAndUser(id: string, userId: string): Promise<IProject | null> {
    return await ProjectModel.findOne({ _id: id, userId }).exec();
  }

  async update(id: string, userId: string, updateData: Partial<IProject>): Promise<IProject | null> {
    return await ProjectModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async delete(id: string, userId: string): Promise<IProject | null> {
    return await ProjectModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}