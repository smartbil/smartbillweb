# 🔐 SmartBill Admin Security System

## 🚨 SECURITY ALERT
This admin dashboard is now protected by **enterprise-grade security measures**. Only authorized admin users can access administrative functions.

## 🛡️ Security Features Implemented

### ✅ Multi-Layer Authentication
- **Middleware Protection**: Routes automatically protected
- **Token Verification**: Firebase Admin SDK validation  
- **Admin Role Verification**: Database-level privilege checking
- **Real-time Validation**: Continuous security monitoring

### ✅ Access Control
- **Role-Based Access**: Only `isAdmin: true` users allowed
- **Session Management**: Secure cookie-based authentication
- **Automatic Logout**: Invalid sessions terminated immediately
- **Rate Limiting**: 100 requests per 15 minutes per IP

### ✅ Security Monitoring
- **Audit Logging**: All admin actions logged
- **Error Tracking**: Security incidents monitored
- **Attack Prevention**: Multiple protection layers
- **Session Security**: Secure token management

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env.local` file with Firebase Admin credentials:
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Grant Admin Access
To make a user an admin, update their Firestore document:
```javascript
// In Firebase Console or using Admin SDK
await db.collection('users').doc(userId).update({
  isAdmin: true,
  adminGrantedAt: new Date()
});
```

### 3. Access Admin Dashboard
- Navigate to `/admin/sign-in`
- Login with admin credentials
- Automatic security verification occurs
- Access granted to admin dashboard

## 🔒 Security Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Login    │───▶│   Middleware     │───▶│  Admin Check    │
│                 │    │   Protection     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Token Storage   │    │ Rate Limiting    │    │ Dashboard       │
│ (Secure Cookie) │    │ & Validation     │    │ Access          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Admin Management

### Using the Setup Script
```typescript
import { setAdminByEmail, listAdminUsers } from './scripts/adminSetup';

// Grant admin access
await setAdminByEmail('admin@company.com');

// List all admins
await listAdminUsers();
```

### Manual Firestore Update
```javascript
// Using Firebase Console
{
  "email": "admin@company.com",
  "username": "Admin User",
  "isAdmin": true,
  "adminGrantedAt": "2025-01-14T...",
  "createdAt": "2025-01-01T...",
  "updatedAt": "2025-01-14T..."
}
```

## 🚫 Security Violations

### What Triggers Security Blocks:
- ❌ No authentication token
- ❌ Invalid/expired token  
- ❌ User not found in database
- ❌ `isAdmin` flag not set to `true`
- ❌ Rate limit exceeded
- ❌ Suspicious activity detected

### What Happens:
1. **Immediate Redirect**: User sent to sign-in page
2. **Session Cleanup**: All tokens cleared
3. **Error Logging**: Security incident recorded
4. **User Notification**: Clear error message shown

## 📊 Security Monitoring

### Built-in Monitoring:
- **Failed Login Attempts**: Tracked and logged
- **Unauthorized Access**: Immediate blocking
- **Rate Limit Violations**: IP-based restrictions
- **Token Anomalies**: Invalid token detection

### Recommended Monitoring:
- Set up alerts for multiple failed attempts
- Monitor admin activity logs
- Regular audit of admin user list
- Review security incident reports

## 🔧 Configuration

### Rate Limiting (app/utils/adminAuth.ts):
```typescript
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window
```

### Cookie Security (app/admin/sign-in/page.tsx):
```typescript
document.cookie = `admin-auth-token=${token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
```

### Middleware Routes (middleware.ts):
```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
```

## 🚨 Security Best Practices

### ✅ DO:
- Use strong passwords for admin accounts
- Enable HTTPS in production
- Regularly review admin user list  
- Monitor security logs
- Keep Firebase credentials secure
- Use IP whitelisting if possible

### ❌ DON'T:
- Share admin credentials
- Store credentials in code
- Bypass security checks
- Grant admin access unnecessarily
- Ignore security warnings
- Use weak authentication

## 🆘 Emergency Procedures

### Lost Admin Access:
1. Use Firebase Admin SDK directly:
```typescript
await adminDb.collection('users').doc(userId).update({
  isAdmin: true,
  emergencyAccess: new Date()
});
```

2. Check server logs for errors
3. Verify environment variables
4. Use Firebase Console as backup

### Security Breach:
1. **Immediate**: Revoke all admin tokens
2. **Investigate**: Check audit logs
3. **Update**: Change passwords and keys
4. **Monitor**: Watch for suspicious activity
5. **Report**: Document incident

## 📝 File Structure

```
├── middleware.ts                    # Route protection
├── app/
│   ├── utils/adminAuth.ts          # Authentication utilities
│   ├── store/adminAuthStore.ts     # Admin auth state
│   ├── admin/
│   │   ├── layout.tsx              # Security wrapper
│   │   ├── sign-in/page.tsx        # Secure login
│   │   └── dashboard/page.tsx      # Protected dashboard
│   ├── components/admin/
│   │   ├── AdminHeader.tsx         # Header with logout
│   │   └── SecurityStatus.tsx      # Security indicator
│   └── api/admin/
│       ├── verify/route.ts         # Admin verification
│       └── users/route.ts          # Protected API
├── scripts/
│   └── adminSetup.ts               # Admin management
└── ADMIN_SECURITY.md               # Detailed docs
```

## 🏆 Security Achievements

- ✅ **Zero Trust Architecture**: Every request verified
- ✅ **Defense in Depth**: Multiple security layers
- ✅ **Principle of Least Privilege**: Admin-only access
- ✅ **Secure by Default**: No bypass mechanisms
- ✅ **Comprehensive Logging**: Full audit trail
- ✅ **Enterprise Grade**: Production-ready security

## 📞 Support

For security issues or questions:
1. Check the detailed documentation in `ADMIN_SECURITY.md`
2. Review the implementation in each security file
3. Test with the provided utilities
4. Monitor logs for any issues

---

**⚠️ IMPORTANT**: This security system is designed to be comprehensive and secure. Do not modify security checks without understanding the implications. Always test changes in a development environment first.
