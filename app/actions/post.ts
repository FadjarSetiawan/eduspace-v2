"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { error: "Not authenticated" };
  }

  const content = formData.get("content") as string;

  if (!content || content.trim().length === 0) {
    return { error: "Content is required" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.post.create({
      data: {
        content,
        // 👇 PERBAIKAN DI SINI:
        // Dulu: authorId: user.id
        // Sekarang:
        userId: user.id, 
      },
    });

    revalidatePath("/dashboard/community");
    return { success: true };

  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}