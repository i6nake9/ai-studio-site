import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { findTask, tasks } from "@/content/tasks";
import { uk } from "@/content/uk";
import { pageMeta } from "@/lib/page-meta";

import { DirectionView } from "./direction-view";
import { TaskView } from "./task-view";

const directions = uk.solutions.items;

// Only the directions and tasks from the content files exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...directions, ...tasks].map((item) => ({ slug: item.slug }));
}

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = `/poslugy/${slug}/`;
  const direction = directions.find((item) => item.slug === slug);
  if (direction) return pageMeta(path, direction.page.metaTitle, direction.page.metaDescription);
  const task = findTask(slug);
  if (task) return pageMeta(path, task.metaTitle, task.metaDescription);
  return {};
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const direction = directions.find((item) => item.slug === slug);
  if (direction) return <DirectionView service={direction} />;
  const task = findTask(slug);
  if (task) return <TaskView task={task} />;
  notFound();
}
