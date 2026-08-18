import { defineCollection, z } from "astro:content";

const proyectos = defineCollection({
    schema: z.object({
        title: z.string(),
        type: z.string(),
        date: z.string(),
        desc: z.string(),
        banner: z.boolean(),
        order: z.number(),
        gallery: z.array(z.object({
            type: z.string(),
            src: z.string().url(),
            link: z.string().url().optional(),
            title: z.string()
        })).optional(),
        credits: z.array(z.object({
            name: z.string(),
            link: z.string().url().optional(),
            skills: z.string(),
            avatar: z.string()
        })).optional(),
        tweets: z.array(z.object({
            src: z.string().url(),
        })).optional()
    })
})

const info = defineCollection({})

export const collections = { proyectos, info }