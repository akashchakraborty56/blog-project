import { Circle } from "./BlogCard";

export const BlogSkeleton = () => {
    return (
        <div role="status" className="animate-pulse w-full">
            <div className="p-6 border-b border-slate-100 cursor-pointer w-full lg:px-20 xl:px-40">
                {/* Author and date row */}
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-24"></div>
                    <Circle />
                    <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                </div>
                
                {/* Title skeleton - wider on desktop */}
                <div className="mt-4 space-y-2">
                    <div className="h-5 bg-gray-200 rounded-full w-full lg:w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-3/4 lg:w-1/2"></div>
                </div>
                
                {/* Content skeleton - multi-column on desktop */}
                <div className="mt-3 space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-2/3 lg:w-full"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-1/2 lg:w-full"></div>
                </div>
                
                {/* Footer skeleton - right-aligned on desktop */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-4 bg-gray-200 rounded-full w-16 mb-2 sm:mb-0"></div>
                    <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};