import Hero from '@/components/Hero';
import Introduce from '@/components/Introduce';
import Features from '@/components/Features/Features';
import CoursePreview from '@/components/CoursePreview/CoursePreview';
import Testimonials from '@/components/Testimonials/Testimonials';
import ContactInfo from '@/components/ContactInfo/ContactInfo';
import ScrollToTop from '@/components/ScrollToTop';

const Home = () => {
  return (
    <>
      <Hero />
      <Introduce />
      <Features />
      <CoursePreview />
      <Testimonials />
      <ContactInfo />
      <ScrollToTop />
    </>
  );
};

export default Home;
