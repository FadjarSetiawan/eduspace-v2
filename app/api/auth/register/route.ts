import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek duplikat
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        totalXp: 0,
        level: 1,
      },
    });

    return NextResponse.json({ message: "Sukses", user }, { status: 201 });
  } catch (error) {
    console.error("REGISTER ERROR:", error); // Cek logs nanti kalau error lagi
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}