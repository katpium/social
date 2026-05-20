"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<void> {
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
            redirect("/login?error=invalid");
        }
        throw error;
    }
}
