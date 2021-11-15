export const isNonEmptyArray = (x: unknown): boolean => {
    return Array.isArray(x) && x.length > 0;
};
