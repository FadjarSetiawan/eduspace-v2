import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET: Ambil Postingan (Hanya yang Induk/Top Level) beserta anak-anaknya
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { parentId: null }, // Cuma ambil induk
      include: {
        user: true,
        children: { // Ambil balasannya sekalian
            include: { user: true },
            orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ message: "Error loading feed" }, { status: 500 });
  }
}

// POST: Kirim Postingan Baru atau Balasan
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ambil parentId juga (kalau ada)
    const { content, parentId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const newPost = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        parentId: parentId || null, // Kalau null berarti postingan baru (induk)
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ message: "Error posting" }, { status: 500 });
  }
}