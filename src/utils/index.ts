export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
}

export function paginate(array: Array<any>, count: number, page: number) {
    const pageLocal = Number(page) === 0 ? 1 : page;

    return array.slice((pageLocal - 1) * count, pageLocal * count);
}