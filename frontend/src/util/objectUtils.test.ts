import { isNonEmptyArray } from './objectUtils';

describe('isNonEmptyArray', () => {
    test('Should return false for null', () => {
        expect(isNonEmptyArray(null)).toEqual(false);
    });
    test('Should return false for undefined', () => {
        expect(isNonEmptyArray(undefined)).toEqual(false);
    });
    test('Should return false for wrong type', () => {
        expect(isNonEmptyArray('string')).toEqual(false);
    });
    test('Should return false for an object', () => {
        expect(isNonEmptyArray({ array: [] })).toEqual(false);
    });
    test('Should return false for empty array', () => {
        expect(isNonEmptyArray([])).toEqual(false);
    });
    test('Should return true for array with one element', () => {
        expect(isNonEmptyArray(['element'])).toEqual(true);
    });
    test('Should return true for populated array', () => {
        expect(isNonEmptyArray([1, 2, 3])).toEqual(true);
    });
});
