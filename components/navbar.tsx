'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { title } from 'process';

const navSections = [
  {
            title: 'Main',

    items: [
      {    
        name: 'Dashboard',
        href: '/dashboard',
        icon: (
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h3.5a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8.5 0a1 1 0 011-1H17a1 1 0 011 1v10a1 1 0 01-1 1h-4.5a1 1 0 01-1-1V4z" />
          </svg>        )
      },
      {
        name: 'Reports',
        href: '/reports',
        icon: (
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2a2 2 0 002-2c0-1.1-.9-2-2-2zm6.39 3.56l1.42 1.42-2.12 2.12-1.42-1.42A6.969 6.969 0 0112 18c-1.58 0-3.03-.53-4.17-1.42l-1.42 1.42-2.12-2.12 1.42-1.42A6.969 6.969 0 016 12c0-1.58.53-3.03 1.42-4.17L6 6.39 8.12 4.27l1.42 1.42A6.969 6.969 0 0112 6c1.58 0 3.03.53 4.17 1.42l1.42-1.42 2.12 2.12-1.42 1.42A6.969 6.969 0 0118 12z" />
          </svg>

        )
      },
      
    ]
  }
];


export default function Navbar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={`h-screen bg-slate-700 fixed flex flex-col shadow-xl z-50 transition-all duration-300 ease-in-out ${
        isHovered ? 'w-60' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8  rounded-lg flex items-center justify-center flex-shrink-0">
            <Image
                src="/logo_v2.png"
                alt="Logo"
                width={100}  
                height={40}
                className="h-8 w-auto"/>
          </div>
          {isHovered && (
            <div className="overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={40}
                className="h-8 w-auto"/>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && isHovered && (
              <div className="px-4 mb-3">
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            
            <div className="space-y-1 px-2">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    pathname === item.href
                      ? ''
                      : 'text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >  
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {isHovered && (
                    <span className="whitespace-nowrap overflow-hidden text-sm font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            JD
          </div>
          {isHovered && (
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium whitespace-nowrap">John Doe</p>
              <p className="text-gray-400 text-xs whitespace-nowrap">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}  