const Testimonials = () => {
    return (
      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">What Our Clients Say</h2>
          <div className="flex space-x-8 justify-center">
            <div className="p-6 bg-white shadow-lg rounded-lg w-80">
            <p className="italic text-black">&quot;POSMaster has transformed the way we manage transactions. It&apos;s simple, intuitive, and incredibly reliable.&quot;</p>
            <p className="font-semibold text-black text-opacity-50 mt-4">John Doe, Retailer</p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg w-80">
              <p className="italic text-black">&quot;The reporting features are outstanding. We can now make smarter decisions faster!&quot;</p>
              <p className="font-semibold text-black text-opacity-50 mt-4">Jane Smith, Store Owner</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  