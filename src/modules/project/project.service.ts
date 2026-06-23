import { ProjectRepository } from './project.repository';
import { IProject, ICreateProjectInput, IUpdateProjectInput } from './project.interfaces';
import { AppError } from '../../shared/utils/app-error';
import { Types } from 'mongoose';

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async createProject(userId: string, input: ICreateProjectInput): Promise<IProject> {
    return await this.projectRepository.create({
      userId: new Types.ObjectId(userId),
      title: input.title,
      description: input.description,
      status: input.status || 'Pending',
    });
  }

  async getAllProjects(userId: string): Promise<IProject[]> {
    return await this.projectRepository.findAllByUserId(userId);
  }

  async getProjectById(id: string, userId: string): Promise<IProject> {
    const project = await this.projectRepository.findByIdAndUser(id, userId);
    if (!project) {
      throw new AppError('Project not found or you do not have permission to access it', 404);
    }
    return project;
  }

  async updateProject(id: string, userId: string, input: IUpdateProjectInput): Promise<IProject> {
    const updatedProject = await this.projectRepository.update(id, userId, input);
    if (!updatedProject) {
      throw new AppError('Project not found or you do not have permission to modify it', 404);
    }
    return updatedProject;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const deletedProject = await this.projectRepository.delete(id, userId);
    if (!deletedProject) {
      throw new AppError('Project not found or you do not have permission to delete it', 404);
    }
  }
}