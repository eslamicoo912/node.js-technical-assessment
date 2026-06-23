import { IPaginationOptions } from '../interfaces/query';

export class QueryFeatures {
    static parse(query: Record<string, string | undefined>, defaultSortBy: string = 'createdAt'): IPaginationOptions {
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 10;

        const validatedPage = page > 0 ? page : 1;
        const validatedLimit = limit > 0 && limit <= 100 ? limit : 10;

        const sortBy = query.sortBy || defaultSortBy;
        const sortOrder: 'asc' | 'desc' = query.sortOrder === 'asc' ? 'asc' : 'desc';

        return {
            page: validatedPage,
            limit: validatedLimit,
            sortBy,
            sortOrder,
        };
    }
}