import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),

})

type SignInData = {
    email: string;
    password: string;
}
type SignUpData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const useAuth = () => {
    const { signIn, signOut } = useAuthActions();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const signInForm = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const signUpForm = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        }
    })

    const handleSignIn = async (data: SignInData) => {
        setIsLoading(true);
        try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                flow: 'signIn'
            });
            router.push('/dashboard');
        } catch (error) {
            console.log(error);
            signInForm.setError('password', { message: 'Invalid email or password' });
        } finally {
            setIsLoading(false);
        }

    }

    const handleSignUp = async (data: SignUpData) => {
        setIsLoading(true); try {
            await signIn("password", {
                email: data.email,
                password: data.password,
                name: `${data.firstName} ${data.lastName}`,
                flow: 'signUp'
            });
            router.push('/dashboard');
        } catch (error) {
            console.log('Error Signing Up', error);
            signUpForm.setError('root', { message: 'Failed to create account. Email may already exsist' });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut();
            router.push('/auth/sign-in');
        } catch (error) {
            console.log('Error Signing Out', error);
        }

        setIsLoading(false);
    }

    return {
        isLoading,
        signInForm,
        signUpForm,
        handleSignIn,
        handleSignUp,
        handleSignOut,
    }
}