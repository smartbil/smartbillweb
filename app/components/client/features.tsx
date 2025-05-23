import Image from "next/image";
import TransactionImg from "@/public/assets/3d-render-money-transfer-mobile-banking-online.jpg";
import InventoryImg from "@/public/assets/rag-doll-checking-wheelbarrow.jpg";
import ReportImg from "@/public/assets/Chart or graphs on sheet of paper 3D illustration.jpg";

const Features = () => {
    return (
      <section id="features" className="p-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black mb-8">Why Choose Our POS System?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col justify-center items-center p-6 bg-white text-black shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden">
              <Image 
                src={TransactionImg} 
                alt="Fast transactions" 
                className="h-[350px] w-full object-cover"
              />
              <h3 className="text-xl font-semibold mb-4 mt-4">Fast and Secure Transactions</h3>
              <p>Our POS system ensures fast and secure transactions, enhancing your customer experience.</p>
            </div>

            <div className="flex flex-col justify-center items-center p-6 bg-white text-black shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden">
              <Image 
                src={InventoryImg} 
                alt="Inventory management" 
                className="h-[350px] w-full object-cover"
              />
              <h3 className="text-xl font-semibold mb-4 mt-4">Inventory Management</h3>
              <p>Keep track of your inventory with ease and never run out of stock again.</p>
            </div>

            <div className="flex flex-col justify-center items-center p-6 bg-white text-black shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 overflow-hidden">
              <Image 
                src={ReportImg} 
                alt="Analytics reports" 
                className="h-[350px] w-full object-cover"
              />
              <h3 className="text-xl font-semibold mb-4 mt-4">Detailed Reports</h3>
              <p>Access real-time sales data and insights to make informed business decisions.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;