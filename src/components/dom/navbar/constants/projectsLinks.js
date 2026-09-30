import { featuredProjects } from '@src/constants/projects';

const projectsLinks = featuredProjects.map((project) => ({
  title: project.title,
  href: project.link,
}));

export default projectsLinks;
