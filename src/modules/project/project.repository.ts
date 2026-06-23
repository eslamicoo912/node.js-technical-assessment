import { ProjectModel } from '../../database/models/project.model';
import { IProject } from './project.interfaces';

export class ProjectRepository {
  async create(projectData: Partial<IProject>): Promise<IProject> {
    const newProject = new ProjectModel(projectData);
    return await newProject.save();
  }

  async findAllByUserId(userId: string): Promise<IProject[]> {
    return await ProjectModel.find({ userId }).exec();
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