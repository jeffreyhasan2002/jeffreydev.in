import Home from '@src/pages/components/home/Index';
import About from '@src/pages/components/about/Index';
import Quote from '@src/pages/components/quote/Index';
import Projects from '@src/pages/components/projects/Index';
import WorkIndex from '@src/pages/components/workIndex/Index';
import Clients from '@src/pages/components/clients/Index';
import CustomHead from '@src/components/dom/CustomHead';

const seo = {
  title: 'Jeffrey - Frontend Developer Portfolio',
  description: 'Jeffrey Hasan is a front-end developer from India building story-driven websites for businesses in India, Germany, Malaysia and the USA, from data centres to wedding photographers.',
  keywords: [
    'Jeffrey',
    'Jeffrey Hasan',
    'Frontend',
    'Engineer',
    'Portfolio',
    'Web Development',
    'React Developer',
    'Developer',
    'Web Applications',
    'Responsive Design',
    'Progressive Web Apps',
    'Freelance Developer',
    'Modern Web Development',
    'cross-platform development',
    'India',
    'JavaScript',
    'Typescript',
    'Next.js',
    'React',
    'React Native',
    'Electron js',
    'HTML',
    'CSS',
  ],
};

function Page() {
  return (
    <>
      <CustomHead {...seo} />
      <Home />
      <About />
      <Clients />
      <Quote />
      <Projects />
      <WorkIndex />
    </>
  );
}

export default Page;
