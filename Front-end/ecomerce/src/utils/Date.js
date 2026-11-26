export function Dashboard() {
    return new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
export function Time() {
    return new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}
