import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const vehicleSchema = z.object({
  brand: z.string().min(2),
  model: z.string().min(1),
  registration: z.string().min(3),
  fuelType: z.string().optional(),
  color: z.string().optional(),
  year: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = vehicleSchema.parse(body);

    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        registration: data.registration,
      },
    });

    if (existingVehicle) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehicle already registered",
        },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
       ownerId: "cmsssxqou00006smpcuegeg83",
        brand: data.brand,
        model: data.model,
        registration: data.registration,
        fuelType: data.fuelType,
        color: data.color,
        year: data.year,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle added successfully",
      vehicle,
    });
  }catch (error) {
  console.log("FULL ERROR:");
  console.log(error);

  return NextResponse.json(
    {
      success: false,
      message: "Failed to add vehicle",
    },
    { status: 500 }
  );
}}