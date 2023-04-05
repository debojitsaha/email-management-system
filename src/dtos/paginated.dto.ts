type PaginationDto = {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    nextPage: number | null;
    prevPage: number | null;
    page: number;
    totalObjects: number;
    totalPages: number;
};

export { PaginationDto };
