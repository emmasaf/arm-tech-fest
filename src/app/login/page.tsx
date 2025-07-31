'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin } from '@/hooks/use-auth'
import { LogIn, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from '@/contexts/translation-context'

const getLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail') || 'Invalid email address'),
  password: z.string().min(1, t('auth.passwordRequired') || 'Password is required'),
})

type LoginForm = {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered') === 'true'
  const t = useTranslations()
  
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: 'safaryanemma05@gmail.com',
      password: 'varujpidoras06'
    }
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync(data)

      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">{t('auth.loginTitle')}</CardTitle>
          <CardDescription>{t('auth.signIn')}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Registration Success Message */}
          {registered && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {t('auth.registrationSuccess') || 'Registration successful! You can now sign in with your credentials.'}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Error Alert */}
            {loginMutation.isError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {loginMutation.error?.message || t('auth.loginFailed') || 'Login failed. Please check your credentials.'}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full hover-glow"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('auth.signIn')}...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('auth.signIn')}
                </>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              {t('auth.noAccount')}{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-500 font-medium">
                {t('auth.signUp')}
              </Link>
            </p>
            {showDemo && (
              <p className="text-xs text-gray-500">
                Demo mode allows quick access without real authentication
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}