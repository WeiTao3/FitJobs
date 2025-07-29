import { JOB_TYPES, EXPERIENCE_LEVELS } from '../constants/job';

export type JobType = typeof JOB_TYPES[number];
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: JobType;
  experience: ExperienceLevel;
  description: string;
  requirements: string[];
  postedDate: string;
  sportType: string;
}