import HeroBanner from '../../../public/assets/herobanner.png';

const Hero = () => {
  return (
    <section
      className="bg-secondary text-white h-screen flex items-center justify-center text-center"
      style={{ backgroundImage: `url(${HeroBanner.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="text-primary">
        <h2 className="text-4xl font-bold mb-4">Streamline Your Business with Our POS System</h2>
        <p className="text-xl mb-6">Efficient. Reliable. Easy to Use.</p>
      </div>
    </section>
  );
};

export default Hero;
