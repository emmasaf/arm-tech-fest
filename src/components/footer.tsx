import Link from "next/link"
import { Calendar, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">ArmFestHub</span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Discover amazing festivals and create unforgettable memories with secure, instant ticket booking.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/festivals" className="text-gray-400 hover:text-white transition-colors">
                                    Browse Festivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                                    Admin Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refunds" className="text-gray-400 hover:text-white transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-purple-400" />
                                <span className="text-gray-400">support@festivalhub.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-purple-400" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-purple-400" />
                                <span className="text-gray-400">New York, NY</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2025 ArmFestHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
