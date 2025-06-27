# Using getCurrentUser API to Fill Input Fields

This document explains how to use the `getCurrentUser` API to populate form fields with current user data in this React/Next.js application.

## Overview

The `getCurrentUser` API allows you to fetch the current authenticated user's data and use it to pre-populate form fields. This is particularly useful for profile editing forms, user settings, or any form that needs to display current user information.

## Implementation Steps

### 1. Create a Custom Hook

First, create a custom hook to fetch current user data:

```typescript
// src/hooks/useGetCurrentUser.tsx
import { getCurrentUser } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const useGetCurrentUser = (options?: Record<string, any>) => {
    return useQuery({
        queryKey: ['getCurrentUser'],
        queryFn: () => getCurrentUser(),
        ...options,
    })
}

export default useGetCurrentUser
```

### 2. Use the Hook in Your Component

```typescript
import { useForm, Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

export default function UserProfileForm() {
    const hasPreloaded = useRef(false);
    
    // Fetch current user data
    const { data: currentUserData, isLoading, isError, refetch } = useGetCurrentUser({
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            email: '',
            tel: '',
            // ... other fields
        }
    });

    // Fill form fields when data is loaded
    useEffect(() => {
        if (!hasPreloaded.current && currentUserData?.success && currentUserData?.data) {
            const userData = currentUserData.data;
            
            // Reset form with current user data
            reset({
                name: userData.name || '',
                email: userData.email || '',
                tel: userData.tel || '',
                // ... map other fields
            });
            
            hasPreloaded.current = true;
        }
    }, [currentUserData, reset]);

    // ... rest of component
}
```

### 3. Key Patterns

#### A. Using `useRef` to Prevent Re-population

```typescript
const hasPreloaded = useRef(false);

useEffect(() => {
    if (!hasPreloaded.current && currentUserData?.success && currentUserData?.data) {
        // Only populate once
        reset(formData);
        hasPreloaded.current = true;
    }
}, [currentUserData, reset]);
```

#### B. Refreshing Data After Updates

```typescript
const onSubmit = async (data: FormValues) => {
    try {
        // Update user data
        await updateUserProfile(data);
        
        // Refresh current user data from API
        await refetch();
        
        // Reset the preloaded flag to allow re-population with fresh data
        hasPreloaded.current = false;
        
        toast.success('プロフィールが更新されました');
    } catch (error) {
        toast.error('更新に失敗しました');
    }
};
```

#### C. Loading and Error States

```typescript
if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

if (isError) {
    return (
        <div className="text-center text-red-500 p-4">
            ユーザー情報の取得に失敗しました
        </div>
    );
}
```

## Examples in the Codebase

### 1. Simple Profile Form

See `src/components/SimpleUserProfileForm.tsx` for a basic example that demonstrates:
- Fetching current user data
- Pre-populating form fields
- Handling loading and error states
- Refreshing data after updates
- Basic form validation with React Hook Form

### 2. Enhanced Profile Page

See `src/app/mypage/profile/page.tsx` for a more complex example that:
- Uses getCurrentUser API as primary data source
- Falls back to auth context if API fails
- Handles different user roles (JobSeeker vs Employer)
- Includes comprehensive form validation
- Uses traditional form handling (not React Hook Form)

### 3. Demo Page

See `src/app/mypage/simple-profile/page.tsx` for a working demo of the simple form.

## API Response Structure

The `getCurrentUser` API returns data in this format:

```typescript
{
    success: boolean;
    data: {
        id: number;
        email: string;
        role: string;
        name?: string;
        name_kana?: string;
        tel: string;
        zip: string;
        prefectures: number;
        city?: string;
        birthdate?: string;
        sex?: number;
        clinic_name?: string;
        clinic_name_kana?: string;
        closest_stataion?: string;
        employee_number?: number;
        establishment_year?: string;
        business?: string;
        home_page_url?: string;
        capital_stock?: string;
        // ... other fields
    }
}
```

## Best Practices

### 1. Caching Strategy

```typescript
const { data, isLoading, isError, refetch } = useGetCurrentUser({
    refetchOnWindowFocus: false,  // Prevent unnecessary refetches
    staleTime: 5 * 60 * 1000,    // Cache for 5 minutes
    cacheTime: 10 * 60 * 1000,   // Keep in cache for 10 minutes
});
```

### 2. Error Handling

```typescript
// Fallback to auth context if API fails
useEffect(() => {
    if (!hasPreloaded.current && profile && !currentUserData) {
        // Use profile from auth context as fallback
        setForm(profileData);
        hasPreloaded.current = true;
    }
}, [profile, currentUserData]);
```

### 3. Form State Management

```typescript
// Only enable submit button when form is dirty
<CButton
    text="更新"
    type="submit"
    disabled={!isDirty}
/>
```

### 4. Data Refresh After Updates

```typescript
// Always refresh data after successful updates
if (updated?.success) {
    await refetch();
    hasPreloaded.current = false; // Allow re-population
}
```

## Common Use Cases

1. **Profile Editing**: Pre-populate user profile forms with current data
2. **Settings Forms**: Load user preferences and settings
3. **Account Management**: Display current account information
4. **Form Cloning**: Use current user data as a template for new forms

## Troubleshooting

### Issue: Form fields not populating
- Check if `currentUserData?.success` is true
- Verify `hasPreloaded.current` is being set correctly
- Ensure `reset()` is being called with the correct data structure

### Issue: Form re-populating on every render
- Make sure `hasPreloaded.current` is being used to prevent re-population
- Check if the `useEffect` dependency array is correct

### Issue: API calls on every focus
- Set `refetchOnWindowFocus: false` in the hook options
- Use appropriate `staleTime` and `cacheTime` values

## Related Files

- `src/lib/api.ts` - Contains the `getCurrentUser` API function
- `src/hooks/useGetCurrentUser.tsx` - Custom hook for fetching current user
- `src/components/SimpleUserProfileForm.tsx` - Basic example with React Hook Form
- `src/app/mypage/profile/page.tsx` - Enhanced example with fallback
- `src/app/mypage/simple-profile/page.tsx` - Demo page 