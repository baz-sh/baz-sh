import { DEFAULT_CONFIGURATION } from './constants';
import type { CollectionEntry } from 'astro:content';

export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC', // Default to UTC to prevent timezone issues
  });

  // Ensure we're parsing the date correctly
  return formatter.format(new Date(date));
};

// Day and month only, for lists that already group by year
export const formatDateShort = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return formatter.format(new Date(date));
};

export const getYear = (date: Date) =>
  new Date(date).getUTCFullYear();

export const groupPostsByYear = (posts: CollectionEntry<'posts'>[]) => {
  const groups = new Map<number, CollectionEntry<'posts'>[]>();

  for (const post of posts) {
    const year = getYear(post.data.date);
    const group = groups.get(year);
    if (group) {
      group.push(post);
    } else {
      groups.set(year, [post]);
    }
  }

  // Posts arrive sorted newest first, so the years come out in the same order
  return [...groups.entries()].map(([year, entries]) => ({ year, entries }));
};

export const generateAbsoluteUrl = (path: string) =>
  DEFAULT_CONFIGURATION.baseUrl.concat(path);

export const isDevelopment = () => import.meta.env.MODE === 'development';

export const includeDraft = (draft: boolean) => {
  if (isDevelopment()) return true;
  return draft !== true;
};

export const sortJobsByDate = (jobs: CollectionEntry<'jobs'>[]) => {
  // Convert "Now" to current year, otherwise returns the year as is
  const getEndYear = (job: CollectionEntry<'jobs'>) =>
    job.data.to === 'Now' ? new Date().getFullYear() : job.data.to;

  return jobs.sort((current, next) => {
    // Compare end years first, then fall back to start years if end years are equal
    const [currentEnd, nextEnd] = [getEndYear(current), getEndYear(next)];
    return nextEnd - currentEnd || next.data.from - current.data.from;
  });
};

export const sortPostsByDate = (posts: CollectionEntry<'posts'>[]) => {
  return posts.sort((current, next) => {
    return new Date(next.data.date).getTime() - new Date(current.data.date).getTime();
  });
};
