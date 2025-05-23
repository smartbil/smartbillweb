import HeroBanner from '../../../public/assets/herobanner.png';

const Hero = () => {
  return (
    <section
      className="bg-secondary text-white h-screen flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${HeroBanner.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="text-primary">
      </div>
    </section>
  );
};

export default Hero;
