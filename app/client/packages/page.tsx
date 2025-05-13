import PackageCard from '@/app/components/package/packagecard';
import React from 'react';

const packages: Package[] = [
  {
    title: 'Basic Plan',
    description: 'A simple and effective solution for small businesses.',
    price: '5000/month',
    features: ['Basic Reporting', 'Unlimited Transactions', '24/7 Support'],
    bgColor: 'primary',
    textColor: 'white',
  },
  {
    title: 'Pro Plan',
    description: 'Packed with advanced features for growing businesses.',
    price: '7000/month',
    features: ['Advanced Reporting', 'Inventory Management', 'Priority Support'],
    bgColor: 'primary',
    textColor: 'white',
  },
  {
    title: 'Enterprise Plan',
    description: 'Comprehensive tools for large businesses with custom needs.',
    price: '10000/month',
    features: ['Custom Reporting', 'Dedicated Support', 'Team Management'],
    bgColor: 'primary',
    textColor: 'white',
  },
];

const PackagesDisplay: React.FC = () => {
  return (
    <section className="p-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-black">Choose Your Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PackageCard
              key={index}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              features={pkg.features}
              bgColor={pkg.bgColor}
              textColor={pkg.textColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesDisplay;
