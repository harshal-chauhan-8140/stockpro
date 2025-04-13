import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { prismaClient } from '../db';
import { HttpError } from '../errors/HTTPError';
import { userToSafeUserTransformer } from '../transformers/userTransformer';
import { sendResponse } from '../utils/response';

export const signup = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findUnique({
        where: { email }
    });

    if (user) throw new HttpError(400, "User alrady exist with given email address. please use another email adress.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            refreshToken,
            refreshTokenExpiresAt: expiresAt
        },
    });

    const userId = user.id.toString();
    const accessToken = generateAccessToken(userId);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh-token',
    });

    const safeUser = userToSafeUserTransformer(user);

    return sendResponse(res, {
        statusCode: 201,
        status: "success",
        message: "User created successfully.",
        data: {
            user: safeUser,
            accessToken
        }
    });
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) throw new HttpError(400, "wrong email address or password provided.");

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordMatched) throw new HttpError(400, "wrong email address or password provided.");

    const userId = user.id.toString();
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prismaClient.user.update({
        where: { id: user.id },
        data: { refreshToken, refreshTokenExpiresAt: expiresAt },
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh-token',
    });

    const safeUser = userToSafeUserTransformer(user);

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: "User email and password verified successfully.",
        data: {
            user: safeUser,
            accessToken
        }
    });
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const token = req.cookies.refreshToken;

    if (!token) throw new HttpError(400, "No refresh token found inside cookie.");

    const user = await prismaClient.user.findFirst({
        where: { refreshToken: token },
    });

    if (!user || user.refreshTokenExpiresAt! < new Date()) throw new HttpError(400, "Invalid refresh token.");

    const newRefreshToken = generateRefreshToken();
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prismaClient.user.update({
        where: { id: user.id },
        data: {
            refreshToken: newRefreshToken,
            refreshTokenExpiresAt: newExpiresAt,
        },
    });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/auth/refresh-token',
    });

    const userId = user.id.toString();
    const accessToken = generateAccessToken(userId);

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: "User refresh token verified successfully.",
        data: {
            accessToken
        }
    });
};

export const logout = async (req: Request, res: Response): Promise<any> => {
    const token = req.cookies.refreshToken;

    if (token) {
        await prismaClient.user.updateMany({
            where: { refreshToken: token },
            data: { refreshToken: null, refreshTokenExpiresAt: null },
        });
    }

    res.clearCookie('refreshToken', { path: '/auth/refresh-token' });

    return sendResponse(res, {
        statusCode: 200,
        status: "success",
        message: "User logged out successfully."
    });
};