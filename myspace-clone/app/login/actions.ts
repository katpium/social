"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            username,
            password,
            redirectTo: `/users/${username}`,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Invalid username or password." };
        }
        throw error;
    }
}
