'use client';

import { useAuthStore } from '@/app/store/authStore';
import router from 'next/router';
import React, { useEffect, useState } from 'react';

const PAYHERE_MERCHANT_ID = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1230646';
const PAYHERE_SANDBOX_URL = process.env.NEXT_PUBLIC_PAYHERE_CHECKOUT_URL;

const packages: Package[] = [
	{
		title: 'Starter Plan',
		price: 'LKR 990/month',
		description: 'Ideal for small businesses and startups',
		features: [
			'1 User Account',
			'Mobile POS Access',
			'Sales & Invoice Management',
			'Basic Inventory Tracking',
			'Daily Backup',
			'Email Support',
		],
		borderColor: 'border-smartbill-green',
		highlightText: '✅ Best for: Micro businesses, kiosks, food stalls',
		bestFor: 'text-smartbill-green',
		buttonColor: 'bg-smartbill-green',
	},
	{
		title: 'Standard Plan',
		price: 'LKR 1,990/month',
		description: 'Perfect for retail shops and service providers',
		features: [
			'Everything in Starter, plus:',
			'3 User Accounts',
			'Web POS Access',
			'Customer Management',
			'Sales & Expense Reports',
			'Discount & Return Handling',
			'Priority Support',
		],
		borderColor: 'border-smartbill-blue',
		highlightText: '✅ Best for: Retail stores, salons, cafes',
		bestFor: 'text-smartbill-blue',
		buttonColor: 'bg-smartbill-blue',
	},
	{
		title: 'Business Plan',
		price: 'LKR 3,990/month',
		description: 'For growing businesses with more advanced needs',
		features: [
			'Everything in Standard, plus:',
			'5 User Accounts',
			'Multi-Device Sync',
			'Purchase Order Management',
			'Barcode Scanner Integration',
			'Product Variant Support',
		],
		borderColor: 'border-smartbill-purple',
		highlightText: '✅ Best for: Boutiques, franchises, services',
		bestFor: 'text-smartbill-purple',
		buttonColor: 'bg-smartbill-purple',
	},
	{
		title: 'Enterprise Plan',
		price: 'Custom Pricing',
		description: 'Tailored solutions for large enterprises',
		features: [
			'Everything in Business, plus:',
			'Unlimited User Accounts',
			'Custom Integrations',
			'Dedicated Account Manager',
			'Priority Onboarding & Training',
			'Premium Support',
		],
		borderColor: 'border-smartbill-yellow',
		highlightText: '✅ Best for: Large chains, enterprises',
		bestFor: 'text-smartbill-yellow',
		buttonColor: 'bg-smartbill-yellow',
	},
];

const PackagesDisplay: React.FC = () => {
	const [showPaymentForm, setShowPaymentForm] = useState(false);
	const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
	});
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderId, setOrderId] = useState<string | null>(null);
	const [payhereLoaded, setPayhereLoaded] = useState(false);
	const [payhereFormData, setPayhereFormData] = useState<any>(null);
	
	const user = useAuthStore((state) => state.user) as UserData | null;

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const existingScript = document.querySelector('script[src*="payhere"]');

			if (!existingScript) {
				const script = document.createElement('script');
				script.src = 'https://www.payhere.lk/lib/payhere.js';
				script.async = true;
				script.onload = () => setPayhereLoaded(true);
				document.body.appendChild(script);
			} else {
				setPayhereLoaded(true);
			}
		}

		return () => {
			const script = document.querySelector('script[src*="payhere"]');
			if (script) document.body.removeChild(script);
		};
	}, []);

	useEffect(() => {
		if (showPaymentForm) {
			setOrderId(`SUB-${Date.now()}`);
		}
	}, [showPaymentForm]);

	const initiatePayhereSubscription = (packageDetails: Package, customerInfo: CustomerInfo) => {
		const payhere = (window as any).payhere;

		if (!payhere) {
			alert('PayHere is not loaded. Please try again.');
			return;
		}

		const amount = packageDetails.price.replace(/[^0-9]/g, '');

		if (!amount || packageDetails.title === 'Enterprise Plan') {
			alert('Please contact us for Enterprise Plan pricing.');
			return;
		}

		if (!orderId) {
			alert('Order ID is not ready. Please try again.');
			return;
		}

		const payment: PayhereParams = {
			merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '1230646',
			return_url: `${window.location.origin}/payment/success`,
			cancel_url: `${window.location.origin}/payment/cancel`,
			notify_url: `${window.location.origin}/api/payment/notify`,
			first_name: customerInfo.firstName,
			last_name: customerInfo.lastName,
			email: customerInfo.email,
			phone: customerInfo.phone,
			address: customerInfo.address,
			city: customerInfo.city,
			country: 'Sri Lanka',
			order_id: orderId,
			items: packageDetails.title,
			currency: 'LKR',
			amount: amount,
			recurrence: '1 Month',
			duration: 'Forever',
			startup_fee: '0',
		};

		payhere.onCompleted = function onCompleted(orderId: string) {
			console.log('Payment completed. OrderID:' + orderId);
			alert(`Payment successful! Order ID: ${orderId}`);
			setShowPaymentForm(false);
			setIsProcessing(false);
			setCustomerInfo({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				address: '',
				city: '',
			});
		};

		payhere.onDismissed = function onDismissed() {
			console.log('Payment dismissed');
			setIsProcessing(false);
		};

		payhere.onError = function onError(error: string) {
			console.log('Error:' + error);
			alert(`Payment error: ${error}`);
			setIsProcessing(false);
		};

		setIsProcessing(true);
		payhere.startPayment(payment);
	};

	const initializeRecurringPayment = async (packageDetails: Package, customerInfo: CustomerInfo) => {
		const payhere = (window as any).payhere;

		if (!payhere) {
			alert('PayHere is not loaded. Please try again.');
			return;
		}

		const amount = packageDetails.price.replace(/[^0-9]/g, '');

		// Initialize recurring payment
		const payment = {
			sandbox: true,
			merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
			return_url: `${window.location.origin}/payment/success`,
			cancel_url: `${window.location.origin}/payment/cancel`,
			notify_url: `${window.location.origin}/api/payment/notify`,
			first_name: customerInfo.firstName,
			last_name: customerInfo.lastName,
			email: customerInfo.email,
			phone: customerInfo.phone,
			address: customerInfo.address,
			city: customerInfo.city,
			country: 'Sri Lanka',
			order_id: orderId,
			items: packageDetails.title,
			currency: 'LKR',
			amount: amount,
			recurrence: '1 Month',
			duration: 'Forever',
			startup_fee: '0',
		};

		payhere.onCompleted = async function onCompleted(orderId: string) {
			try {
				const response = await fetch('/api/subscription/manage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: user?.uid,
						subscriptionData: payment,
						orderId,
						packageDetails,
						status: 'active',
					}),
				});

				const result = await response.json();

				if (result.success) {
					alert('Subscription activated successfully!');
					router.push('/client/profile');
				} else {
					alert('Failed to activate subscription. Please contact support.');
				}
			} catch (error) {
				console.error('Error saving subscription:', error);
				alert('An error occurred while activating your subscription.');
			} finally {
				setIsProcessing(false);
				setShowPaymentForm(false);
			}
		};

		payhere.onError = function onError(error: string) {
			console.error('Payment error:', error);
			alert('Payment failed. Please try again.');
			setIsProcessing(false);
		};

		setIsProcessing(true);
		payhere.startPayment(payment);
	};

	const handleGetStarted = (pkg: Package) => {
		if (pkg.title === 'Enterprise Plan') {
			alert('Please contact our sales team for Enterprise Plan pricing and setup.');
			return;
		}
		setSelectedPackage(pkg);
		setShowPaymentForm(true);
	};

	const handlePayment = async () => {
		console.log("Hash generate req")
		if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
			alert('Please fill in all required fields.');
			return;
		}
		if (!selectedPackage) return;

		const orderId = `SUB-${Date.now()}`;
		const amount = selectedPackage.price.replace(/[^0-9.]/g, '');
		const currency = 'LKR';

		// 1. Get hash from backend
		const hashRes = await fetch('/api/payhere/generate-hash', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				merchant_id: PAYHERE_MERCHANT_ID,
				order_id: orderId,
				amount,
				currency,
			}),
		});
		const hashData = await hashRes.json();
		
		if (!hashData.success) {
			alert('Failed to generate payment hash');
			return;
		}

		// 2. Prepare form data for PayHere
		setPayhereFormData({
			merchant_id: PAYHERE_MERCHANT_ID,
			return_url: `${window.location.origin}/payment/success`,
			cancel_url: `${window.location.origin}/payment/cancel`,
			notify_url: `${window.location.origin}/api/payment/notify`,
			first_name: customerInfo.firstName,
			last_name: customerInfo.lastName,
			email: customerInfo.email,
			phone: customerInfo.phone,
			address: customerInfo.address,
			city: customerInfo.city,
			country: 'Sri Lanka',
			order_id: orderId,
			items: selectedPackage.title,
			currency,
			amount,
			recurrence: '1 Month',
			duration: 'Forever',
			startup_fee: '0',
			hash: hashData.hash,
			custom_1: user?.uid, 
		});
	};

	useEffect(() => {
		if (payhereFormData) {
			const form = document.getElementById('payhere-form') as HTMLFormElement | null;
			if (form) {
				form.submit();
			}
			setPayhereFormData(null);
		}
	}, [payhereFormData]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCustomerInfo({
			...customerInfo,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<>
			{/* Suppress hydration warnings for entire component */}
			<div suppressHydrationWarning className="font-inter bg-smartbill-dark-blue text-black min-h-screen">
				{showPaymentForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						<div className="bg-white text-black rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold">Subscribe to {selectedPackage?.title}</h3>
								<button
									onClick={() => setShowPaymentForm(false)}
									className="text-gray-500 hover:text-gray-700 text-2xl"
									disabled={isProcessing}
								>
									×
								</button>
							</div>

							<div className="mb-4 p-4 bg-gray-100 rounded-lg">
								<p className="font-semibold">{selectedPackage?.title}</p>
								<p className="text-lg text-primary">{selectedPackage?.price}</p>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-1">First Name *</label>
										<input
											type="text"
											name="firstName"
											value={customerInfo.firstName}
											onChange={handleInputChange}
											className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
											disabled={isProcessing}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1">Last Name *</label>
										<input
											type="text"
											name="lastName"
											value={customerInfo.lastName}
											onChange={handleInputChange}
											className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
											disabled={isProcessing}
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">Email *</label>
									<input
										type="email"
										name="email"
										value={customerInfo.email}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										disabled={isProcessing}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">Phone *</label>
									<input
										type="tel"
										name="phone"
										value={customerInfo.phone}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										disabled={isProcessing}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">Address</label>
									<input
										type="text"
										name="address"
										value={customerInfo.address}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										disabled={isProcessing}
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1">City</label>
									<input
										type="text"
										name="city"
										value={customerInfo.city}
										onChange={handleInputChange}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
										disabled={isProcessing}
									/>
								</div>

								<div className="flex space-x-3 pt-4">
									<button
										type="button"
										onClick={() => setShowPaymentForm(false)}
										className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										disabled={isProcessing}
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handlePayment}
										className="flex-1 py-2 px-4 bg-secondary text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
										disabled={isProcessing}
									>
										{isProcessing ? 'Processing...' : 'Subscribe Now'}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				<section className="flex flex-col justify-between px-4 py-8 sm:py-12">
					<div className="container mx-auto text-center mb-12 sm:mb-16">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
							SmartBill Pricing Plans
						</h1>
						<p className="text-lg sm:text-xl text-smartbill-light-blue max-w-3xl mx-auto">
							Flexible and Transparent Pricing to Suit Every Business
						</p>
						<p className="mt-4 text-base sm:text-lg text-smartbill-light-blue max-w-4xl mx-auto">
							Whether you&apos;re just starting out or managing a growing enterprise, SmartBill has a package that
							fits your needs. All plans include access to both the Web and Mobile POS, real-time sync, cloud
							backup, and dedicated support.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
						{packages.map((pkg, index) => (
							<div
								key={index}
								className={`bg-accent bg-opacity-10 backdrop-blur-sm rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4`}
							>
								<h2 className={`text-2xl font-semibold mb-2 ${pkg.bestFor}`}>{pkg.title}</h2>
								<p className="text-2xl font-bold mb-4 text-primary">{pkg.price}</p>
								<p className="text-smartbill-light-blue mb-6">{pkg.description}</p>
								<ul className="text-black text-base space-y-3 flex-grow">
									{pkg.features.map((feature, i) => (
										<li key={i} className="flex items-center">
											<span className={`${pkg.bestFor} mr-2`}>✔</span> {feature}
										</li>
									))}
								</ul>
								<div className="mt-6 pt-6 border-t border-smartbill-light-blue border-opacity-30">
									<p className="text-primary text-lg mb-4">{pkg.highlightText}</p>
									<button
										onClick={() => handleGetStarted(pkg)}
										className={`w-full py-3 px-6 rounded-lg text-white font-semibold bg-secondary hover:bg-opacity-90 transition-colors duration-200 shadow-md`}
									>
										{pkg.title === 'Enterprise Plan' ? 'Contact Sales' : 'Get Started'}
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				<form
					id="payhere-form"
					method="POST"
					action={PAYHERE_SANDBOX_URL}
					style={{ display: 'none' }}
				>
					{payhereFormData &&
						Object.entries(payhereFormData).map(([key, value]) => (
							<input key={key} type="hidden" name={key} value={String(value)} />
						))}
				</form>
			</div>
		</>
	);
};

export default PackagesDisplay;