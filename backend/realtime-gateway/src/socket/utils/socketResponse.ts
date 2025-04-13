export default function socketResponse(status: string, event: string, message: string, data?: Record<string, any>) {
    return {
        status,
        event,
        message,
        data: data ?? undefined
    }
}