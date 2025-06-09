import { Link } from "react-router-dom";

interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export function Circle() {
    return (
        <div className="h-1 w-1 rounded-full bg-slate-400 mx-2"></div>
    );
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
    
    return (
        <div 
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-full 
                ${size === "small" 
                    ? "w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600" 
                    : "w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700"
                }`}
        >
            <span className={`font-medium text-white 
                ${size === "small" ? "text-xs" : "text-md"}`}
            >
                {(name?.[0] || 'U').toUpperCase()}
            </span>
        </div>
    );
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`} className="group">
            <div className="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 cursor-pointer max-w-2xl mx-auto">
                <div className="flex items-center">
                    <Avatar name={authorName} />
                    <div className="font-medium pl-2 text-sm text-slate-700">{authorName}</div>
                    <Circle />
                    <div className="text-slate-500 text-sm">
                        {publishedDate}
                    </div>
                </div>
                
                <div className="pt-3">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                        {title}
                    </h2>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                        {content.slice(0, 150) + (content.length > 150 ? "..." : "")}
                    </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                        {`${Math.ceil(content.length / 200)} min read`}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors duration-150">
                        Read more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};