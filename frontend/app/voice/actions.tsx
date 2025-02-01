"use server"

import fs from "fs/promises"
import path from "path"

export async function saveAudioFile(formData: FormData) {
  const file = formData.get("audio") as File
  if (!file) {
    throw new Error("No file uploaded")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `recording_${Date.now()}.webm`
  const filepath = path.join(process.cwd(), "public", "recordings", filename)

  await fs.mkdir(path.dirname(filepath), { recursive: true })
  await fs.writeFile(filepath, buffer)

  return { success: true, filename }
}

