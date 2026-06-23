import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { catchAsync } from '../../shared/utils/catch-async';
import { QueryFeatures } from '../../shared/utils/query-features';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    create = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const project = await this.projectService.createProject(userId, req.body);
        res.status(201).json({ status: 'success', data: project });
    });

    getAll = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;

        // pagination and sorting
        const options = QueryFeatures.parse(req.query as Record<string, string>, 'createdAt');

        const projects = await this.projectService.getAllProjects(userId, options);
        res.status(200).json({ status: 'success', count: projects.length, data: projects });
    });

    getOne = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const { id } = req.params;
        const project = await this.projectService.getProjectById(id as string, userId);
        res.status(200).json({ status: 'success', data: project });
    });

    update = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const { id } = req.params;
        const project = await this.projectService.updateProject(id as string, userId, req.body);
        res.status(200).json({ status: 'success', data: project });
    });

    delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.userId;
        const { id } = req.params;
        await this.projectService.deleteProject(id as string, userId);
        res.status(204).json({ status: 'success', data: null });
    });
}