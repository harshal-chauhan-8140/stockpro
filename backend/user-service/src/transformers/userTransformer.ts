import { User } from "../db"

export function userToSafeUserTransformer(user: User) {
    return {
        name: user.name,
        email: user.email,
        availableBalance: user.availableBalance,
        reservedBalance: user.reservedBalance,
        refreshToken: user.refreshToken,
        refreshTokenExpiresAt: user.refreshTokenExpiresAt
    }
}