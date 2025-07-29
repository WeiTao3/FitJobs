import React, { useState } from 'react';
import { Header } from './components/layout';
import { SearchFilters } from './components/filters';
import { JobGrid } from './components/job';
import { PostJobModal, JobDetailModal } from './components/modal';
import { Job } from './types/Job';
import { ThemeProvider } from './contexts/ThemeContext';
import { mockJobs } from './data/jobs';
import AuthForm from './components/auth/AuthForm';

export interface FilterState {
  search: string;
  location: string;
  jobType: string;
  experience: string;
}

function App() {
  const [jobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    jobType: '',
    experience: ''
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    const filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(newFilters.search.toLowerCase()) ||
                           job.company.toLowerCase().includes(newFilters.search.toLowerCase());
      const matchesLocation = newFilters.location === '' || job.location.toLowerCase().includes(newFilters.location.toLowerCase());
      const matchesJobType = newFilters.jobType === '' || job.type === newFilters.jobType;
      const matchesExperience = newFilters.experience === '' || job.experience === newFilters.experience;
      
      return matchesSearch && matchesLocation && matchesJobType && matchesExperience;
    });
    
    setFilteredJobs(filtered);
  };

  const handlePostJob = () => {
    setIsPostModalOpen(true);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetail = () => {
    setSelectedJob(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Header onPostJob={handlePostJob} />
        <main className="container mx-auto px-6 py-8 max-w-6xl">
          <SearchFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <JobGrid jobs={filteredJobs} onJobClick={handleJobClick} />
        </main>
        
        <PostJobModal 
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />

        <JobDetailModal 
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={handleCloseJobDetail}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;