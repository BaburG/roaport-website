'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveReport(id: number) {
  await prisma.reports.update({
    where: { id },
    data: { verified: new Date() },
  });
  revalidatePath(`/post/${id}`);
}

export async function rejectReport(id: number) {
  await prisma.reports.update({
    where: { id },
    data: { verified: null },
  });
  revalidatePath(`/post/${id}`);
}
