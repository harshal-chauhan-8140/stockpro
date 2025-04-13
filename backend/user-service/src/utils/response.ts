import { Response } from "express";

export const sendResponse = (
    res: Response,
    {
        statusCode,
        status,
        message,
        data,
        context,
    }: {
        statusCode: number;
        status: "success" | "error";
        message: string;
        data?: Record<string, any>;
        context?: Record<string, any>;
    }
) => {
    return res.status(statusCode).json({
        status,
        message,
        data: data ?? undefined,
        context: context ?? undefined,
    });
};
