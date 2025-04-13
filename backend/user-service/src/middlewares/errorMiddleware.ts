import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HTTPError";
import { sendResponse } from "../utils/response";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        if (err.logging) {
            console.error(JSON.stringify({
                code: err.statusCode,
                errors: err.message,
                stack: err.stack,
                context: err.context
            }, null, 2));
        }

        return sendResponse(res, {
            statusCode: err.statusCode,
            status: "error",
            message: err.message,
            context: err.context
        });
    }

    console.error(err);
    res.status(500).send({
        status: "error",
        message: "Something went wrong"
    });
};
