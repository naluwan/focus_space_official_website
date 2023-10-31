import AboutNavigateBar from './_components/about-navigatebar';
import AboutUs from './_components/about-us';
import AboutHero from './_components/about-hero';
import AboutIntroduce from './_components/about-introduce';

import heroImg1 from '@/public/aboutHero.jpeg';
import heroImg2 from '@/public/aboutHero2.jpg';

const AboutPage = () => {
  return (
    <div className='relative h-full bg-black text-white'>
      {/* TODO:導覽列 */}
      <AboutNavigateBar />
      <AboutHero img={heroImg1} title='about us' />
      <AboutUs />
      <AboutHero img={heroImg2} title='founder' />
      <AboutIntroduce />
    </div>
  );
};

export default AboutPage;
