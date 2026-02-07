import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, Email, dan Password wajib diisi." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email ini sudah terdaftar. Silakan login saja." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        totalXp: 0,
        level: 1,
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil!", user },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}