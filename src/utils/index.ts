export * from './fileManagement';
export * from './validation';
import { v4 as uuidv4 } from 'uuid';

export function paginate(array: Array<any>, count: number, page: number) {
    const pageLocal = Number(page) === 0 ? 1 : page;

    return array.slice((pageLocal - 1) * count, pageLocal * count);
}

export function uuid() { return uuidv4() }