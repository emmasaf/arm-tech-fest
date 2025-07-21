'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLogin } from '@/hooks/use-auth'
import { mockUsers } from '@/lib/auth'
import { Role } from '@/generated/prisma'
import { LogIn, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>('USER')
  const [showDemo, setShowDemo] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered') === 'true'
  
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
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

  const handleDemoLogin = (role: Role) => {
    // Find user with the selected role for demo purposes
    const user = mockUsers.find(u => u.role === role) || mockUsers[0]
    
    // Set mock authentication
    localStorage.setItem('user-id', user.id)
    localStorage.setItem('user-role', user.role)
    
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const fillDemoCredentials = () => {
    // Use environment variables for demo credentials
    setValue('email', process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'safaryanemma05@gmail.com')
    setValue('password', process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'varujpidoras06')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Registration Success Message */}
          {registered && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! You can now sign in with your credentials.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
                  {loginMutation.error?.message || 'Login failed. Please check your credentials.'}
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
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Demo Section */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-gray-600">Demo Mode:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDemo(!showDemo)}
              >
                {showDemo ? 'Hide' : 'Show'} Demo Options
              </Button>
            </div>
            
            {showDemo && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fillDemoCredentials}
                  className="w-full text-sm"
                >
                  Fill Demo Credentials
                </Button>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Quick Demo Login:</Label>
                  <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      <SelectItem value="MODERATOR">Moderator</SelectItem>
                      <SelectItem value="ORGANIZER">Organizer</SelectItem>
                      <SelectItem value="SUPPORT">Support</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => handleDemoLogin(selectedRole)} 
                    className="w-full hover-glow"
                    variant="secondary"
                    size="sm"
                  >
                    Demo Sign In as {selectedRole.toLowerCase().replace('_', ' ')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-500 font-medium">
                Create one here
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