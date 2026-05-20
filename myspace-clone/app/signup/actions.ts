"use server";

import { signIn } from "@/auth";
import { getUsers, writeUsers, type User } from "@/app/data/users";
import { redirect } from "next/navigation";

export async function signUpAction(formData: FormData) {
    const username = String(formData.get("username") ?? "")
        .trim()
        .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        redirect("/signup?error=username");
    }
    if (password.length < 6) {
        redirect("/signup?error=password");
    }
    if (name.length === 0 || name.length > 50) {
        redirect("/signup?error=name");
    }

    const users = getUsers();
    if (users.find((u) => u.username === username)) {
        redirect("/signup?error=taken");
    }

    const newUser: User = {
        username,
        password,
        name,
        status: "Just joined spacehey!",
        bio: "",
        mood: "new here",
        about: "",
        answer: "",
        interests: {
            general: "",
            music: "",
            movies: "",
            television: "",
            books: "",
            heroes: "",
        },
        friends: [],
        favorites: [],
    };
    users.push(newUser);
    writeUsers(users);

    await signIn("credentials", {
        username,
        password,
        redirectTo: `/users/${username}`,
    });
}
