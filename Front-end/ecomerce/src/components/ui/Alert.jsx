export function showAlert(messageOrError, type = "success") {
    const Alert = document.createElement("div");

    const message = (messageOrError instanceof Error)
        ? messageOrError.message
        : messageOrError;
    const statusCode = (messageOrError instanceof Error && messageOrError.status)
        ? messageOrError.status
        : null;

    const color = {
        success: "bg-green-500",
        error: "bg-red-500",
    };


    Alert.className = `
        fixed bottom-6 left-6 z-[9999]
        flex items-center gap-2
        ${color[type]} text-white
        px-5 py-3 rounded-xl shadow-lg
        text-sm font-semibold
        transition-all duration-300 opacity-0 translate-y-4
    `;

    const error = (type === "error" && statusCode != null)
        ? `<span class="ml-1 opacity-75">[${statusCode}]</span>`
        : "";

    Alert.innerHTML = `<span>${message}${error}</span>`;
    document.body.appendChild(Alert);

    // Hiệu ứng hiện ra
    setTimeout(() => {
        Alert.classList.remove("opacity-0", "translate-y-4");
        Alert.classList.add("opacity-100", "translate-y-0");
    }, 10);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        Alert.classList.remove("opacity-100", "translate-y-0");
        Alert.classList.add("opacity-0", "translate-y-4");
        setTimeout(() => Alert.remove(), 300);
    }, 2000);
}