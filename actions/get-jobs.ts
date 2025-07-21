import { Job } from '@/generated/prisma';
import { db } from '../src/lib/db';
import { auth } from '@clerk/nextjs/server';

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    // Initialize the query object with common options
    let query: any = {
      where: {
        isPublished: true,
        ...(categoryId && { categoryId }), // Apply categoryId filter if provided
        ...(title && { title: { contains: title, mode: 'insensitive' } }), // Case-insensitive title search
        ...(shiftTiming && { shiftTiming }),
        ...(workMode && { workMode }),
        ...(yearsOfExperience && { yearsOfExperience }),
        ...(createdAtFilter && {
          createdAt: { gte: new Date(createdAtFilter) }, // Filter by creation date
        }),
        ...(savedJobs && userId && {
          savedBy: { some: { userId } }, // Filter for saved jobs if userId exists
        }),
      },
      include: {
        company: true,
        category: true,
        // attachments: true, // Uncomment if needed
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    console.log('Query:', JSON.stringify(query, null, 2)); // Debug query

    // Execute the query to fetch jobs
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error('[GET_JOBS]:', error);
    return [];
  }
};