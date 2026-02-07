// File: app/actions/post.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPost(formData: FormData) {
  // 1. Cek User Login
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  // 2. Ambil data
  const content = formData.get("content") as string;
  if (!content || content.trim().length === 0) return;

  // 3. Cari User ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  // 4. Simpan Post
  await prisma.post.create({
    data: {
      content: content,
      authorId: user.id,
    },
  });

  // 5. Refresh Halaman (Biar post baru langsung muncul)
  revalidatePath("/dashboard/community");
}