const Features = () => {
    return (
      <section id="features" className="p-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-8">Why Choose Our POS System?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white text-black shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Fast and Secure Transactions</h3>
              <p>Our POS system ensures fast and secure transactions, enhancing your customer experience.</p>
            </div>
            <div className="p-6 bg-white text-black shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Inventory Management</h3>
              <p>Keep track of your inventory with ease and never run out of stock again.</p>
            </div>
            <div className="p-6 bg-white text-black shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Detailed Reports</h3>
              <p>Access real-time sales data and insights to make informed business decisions.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  