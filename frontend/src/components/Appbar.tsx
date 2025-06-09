import { Avatar } from "./BlogCard"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react" // Import icons for mobile menu

export const Appbar = ({ name }: { name: string }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Desktop Navigation */}
            <div className="border-b border-gray-200 flex justify-between px-4 sm:px-6 md:px-10 py-4 bg-white shadow-sm">
                <Link 
                    to={'/blogs'} 
                    className="flex flex-col justify-center cursor-pointer"
                >
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        MindScribe
                    </span>
                </Link>
                
                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to={`/publish`}>
                        <button 
                            type="button" 
                            className="relative inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 overflow-hidden font-medium text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md hover:shadow-lg"
                        >
                            <span className="relative">New Post</span>
                        </button>
                    </Link>

                    <div className="hover:scale-105 transition-transform duration-200">
                        <Avatar size={"big"} name={name} />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md px-4 py-3 border-b border-gray-200">
                    <div className="flex flex-col space-y-3">
                        <Link 
                            to={`/publish`}
                            className="w-full text-center py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium rounded-lg shadow-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            New Post
                        </Link>
                        <div className="flex justify-center py-2">
                            <Avatar size={"big"} name={name} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}