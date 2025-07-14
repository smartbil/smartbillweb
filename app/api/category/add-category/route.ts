import { NextRequest, NextResponse } from 'next/server';
import { requireClientAuth, checkClientRateLimit } from '@/app/utils/clientAuth';
import { db } from '@/firebase';
import { doc, addDoc, updateDoc, collection, getDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        // Check rate limit
        const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        if (!checkClientRateLimit(`add-category-${clientIP}`)) {
            return NextResponse.json(
                { success: false, message: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify client authentication
        const clientUser = await requireClientAuth(req);
        
        const { name, description, shopId, categoryId } = await req.json();

        if (!name || !description || !shopId) {
            return NextResponse.json(
                { success: false, message: 'Required fields (name, description, shopId) are missing.' },
                { status: 400 }
            );
        }

        // Verify that the user owns the shop they're trying to modify
        if (shopId !== clientUser.shopId && shopId !== clientUser.uid) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: You can only modify your own shop data.' },
                { status: 403 }
            );
        }

        if (name.trim().length < 3) {
            return NextResponse.json(
                { success: false, message: 'Category name must be at least 3 characters long.' },
                { status: 400 }
            );
        }

        if (categoryId) {
            const categoryRef = doc(db, `shops/${shopId}/categories`, categoryId);
            
            const categorySnap = await getDoc(categoryRef);
            if (!categorySnap.exists()) {
                return NextResponse.json(
                    { success: false, message: 'Category not found.' },
                    { status: 404 }
                );
            }

            await updateDoc(categoryRef, {
                name: name.trim(),
                description: description.trim(),
                updatedAt: new Date(),
                updatedBy: clientUser.uid
            });

            return NextResponse.json(
                { success: true, message: 'Category updated successfully.', categoryId },
                { status: 200 }
            );
        } else {
            const categoriesRef = collection(db, `shops/${shopId}/categories`);
            
            const newCategoryRef = await addDoc(categoriesRef, {
                name: name.trim(),
                description: description.trim(),
                status: 'active',
                createdAt: new Date(),
                createdBy: clientUser.uid,
                updatedAt: new Date(),
                updatedBy: clientUser.uid
            });

            return NextResponse.json(
                { success: true, message: 'Category added successfully.', categoryId: newCategoryRef.id },
                { status: 201 }
            );
        }

    } catch (error) {
        console.error('Error in add-category API:', error);
        
        // Handle authentication errors
        if (error instanceof Error) {
            if (error.message.includes('No authorization') || error.message.includes('Invalid or unauthorized')) {
                return NextResponse.json(
                    { success: false, message: 'Authentication required' },
                    { status: 401 }
                );
            }
            if (error.message.includes('not active')) {
                return NextResponse.json(
                    { success: false, message: 'Account suspended' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}