import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export const POST = async (req: NextRequest) => {
    try {
        // Check rate limit
        const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkClientRateLimit(`add-product-${clientIP}`)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify client authentication
        const clientUser = await requireClientAuth(req);

        const { 
            name, 
            stock, 
            sellingprice, 
            purchaseprice, 
            category, 
            brand, 
            imagepath, 
            status, 
            id: productId,
            shopId
        } = await req.json();

        // Verify shop ownership
        if (shopId !== clientUser.shopId) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        if (!name || !stock || !sellingprice || !purchaseprice || !category || !brand || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields are missing.' },
                { status: 400 }
            );
        }

        if (stock < 0 || sellingprice < 0 || purchaseprice < 0) {
            return NextResponse.json(
                { success: false, message: 'Numerical values cannot be negative.' },
                { status: 400 }
            );
        }

        if (productId) {
            const productRef = doc(db, `shops/${shopId}/products`, productId);
            const productSnap = await getDoc(productRef);
            
            if (!productSnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Product not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(productRef, {
                name: name.trim(),
                stock: Number(stock),
                sellingprice: Number(sellingprice),
                purchaseprice: Number(purchaseprice),
                category,
                brand,
                imagepath: imagepath || null,
                status: status || 'active',
                updatedAt: new Date()
            });

            return NextResponse.json(
                { success: true, message: 'Product updated successfully.', productId },
                { status: 200 }
            );
        } else {
            const productsRef = collection(db, `shops/${shopId}/products`);
            const newProductRef = await addDoc(productsRef, {
                name: name.trim(),
                stock: Number(stock),
                sellingprice: Number(sellingprice),
                purchaseprice: Number(purchaseprice),
                category,
                brand,
                imagepath: imagepath || null,
                status: status || 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Product added successfully', 
                    productId: newProductRef.id 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        
        // Handle authentication errors
        if (error instanceof Error) {
            if (error.message.includes('Authentication')) {
                return NextResponse.json(
                    { success: false, message: 'Authentication required' },
                    { status: 401 }
                );
            }
        }
        
        return NextResponse.json(
            { success: false, message: 'Failed to process product' },
            { status: 500 }
        );
    }
};