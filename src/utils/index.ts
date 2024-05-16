export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidPhone(phone: string) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone);
}