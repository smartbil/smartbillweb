'use client';
import Image from 'next/image';
import React from 'react';
import Logo from '@/public/assets/iconpng.png';
import { useSpring, animated, config } from 'react-spring';

const Hero = () => {
    const logoSpring = useSpring({
        loop: true,
        from: { transform: 'rotate(0deg) translateY(0px)' },
        to: [
            { transform: 'rotate(20deg) translateY(-10px)' },
            { transform: 'rotate(-20deg) translateY(10px)' },
            { transform: 'rotate(0deg) translateY(0px)' },
        ],
        config: { ...config.molasses, duration: 5000 }, 
    });

    return (
        <section className="bg-secondary text-white h-screen flex items-center justify-center text-center relative overflow-hidden py-8 md:py-24 lg:py-32">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-70 z-0"></div>
            <div className="absolute rounded-full bg-accent/20 blur-xl animate-pulse duration-1000 top-1/4 left-1/4 w-24 h-24 md:w-48 md:h-48 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute rounded-full bg-highlight/20 blur-xl animate-pulse animation-delay-500 duration-1000 bottom-1/3 right-1/3 w-32 h-32 md:w-64 md:h-64 transform translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10 px-6 md:px-12 lg:px-24">
                <div className="mb-6 md:mb-8">
                    <animated.div style={logoSpring} className="max-w-xs mx-auto h-auto">
                        <Image src={Logo} alt="POS System" className="w-full h-auto" />
                    </animated.div>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 animate-fadeSlideRight">
                    Streamline Your <span className="text-accent">Business</span>
                </h1>
                <p className="text-lg md:text-xl animate-fadeSlideLeft delay-300">
                    Efficient | Reliable | Easy to use
                </p>
                <div className="mt-6 md:mt-8">
                    <a 
                        href="/smartbill.apk" 
                        download="Smart-Bill.apk"
                        className="bg-accent text-white font-semibold py-2.5 px-5 md:py-3 md:px-6 rounded-lg shadow-md hover:bg-highlight transition-colors animate-fadeIn delay-500 text-base md:text-lg inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download APK
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;