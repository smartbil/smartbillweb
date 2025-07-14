import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Define available packages - matching the actual pricing structure
    const packages = [
      {
        id: 'starter',
        name: 'Starter Plan',
        description: 'Ideal for small businesses and startups',
        price: 990,
        priceDisplay: 'LKR 990/month',
        features: [
          'Mobile POS Access',
          'Sales & Invoice Management', 
          'Inventory Tracking',
          'Email Support'
        ]
      },
      {
        id: 'standard',
        name: 'Standard Plan',
        description: 'Perfect for retail shops and service providers',
        price: 1990,
        priceDisplay: 'LKR 1,990/month',
        features: [
          'Everything in Starter, plus:',
          'Supplier Management',
          'Customer Management', 
          'Sales & Expense Reports',
          'Discount Handling',
          'Priority Support'
        ]
      },
    ];

    return NextResponse.json({
      success: true,
      packages
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch packages', error: String(error) },
      { status: 500 }
    );
  }
}
