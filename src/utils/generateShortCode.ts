function generateShortCode(): string {
    const shortCode = Math.random().toString(36).substring(2, 8)
    return shortCode;
}

export {generateShortCode}