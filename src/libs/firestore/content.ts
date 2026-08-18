import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { firestore } from '../firebase-admin/config'

async function uploadContentToFirestore(filePath: string, collection = "projects", lang?: "en" | "es") {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(filePath, path.extname(filePath));

  const docData = {
    slug,
    ...data,
    content: content.trim(),
  };

  await firestore
    .collection(`${collection}_${lang ?? "default"}`)
    .doc(slug)
    .set(docData, { merge: true });

  console.log(`✅ ${lang?.toUpperCase()}: ${slug}`);
}

async function uploadFolder(folderPath: string, collection: string, lang: "en" | "es") {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);

    if (fs.statSync(fullPath).isFile() && path.extname(file) === ".md") {
      await uploadContentToFirestore(fullPath, collection, lang);
    }
  }
}

export async function uploadAllProjects() {
  await uploadFolder("./src/content/proyectos/en", "projects", "en");
  await uploadFolder("./src/content/proyectos/es", "projects", "es");

  console.log("🔥 Todos los proyectos subidos");
}