document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById("sidebar-placeholder");
    if (!placeholder) return;

    // Detect the current page's filename to dynamically highlight the active link
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);

    // List of sidebar links with their targets, labels, and SVG icon paths
    const links = [
        {
            href: "index.html",
            label: "INDEX",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>`
        },
        {
            href: "Monet-App-Overview.html",
            label: "Monet App Overview",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`
        },
        {
            href: "Card-Optimizer.html",
            label: "Card Optimizer",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2m-6 9l2 2 4-4"></path>`
        },
        {
            href: "Croe-Backend.html",
            label: "Croe Backend",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>`
        },
        {
            href: "Database-Schema.html",
            label: "Database Schema",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>`
        },
        {
            href: "Monet-Website.html",
            label: "Monet Website",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>`
        },
        {
            href: "Monet-iOS-App.html",
            label: "Monet iOS App",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>`
        },
        {
            href: "Plaid-Integration.html",
            label: "Plaid Integration",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>`
        },
        {
            href: "../design-system.html",
            label: "Monet Design System",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>`
        },
        {
            href: "logs.html",
            label: "logs",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
        }
    ];

    // Build the links HTML
    let linksHtml = "";
    links.forEach(link => {
        // Check if this link is active
        const isActive = (filename === link.href) || 
                         (filename === "" && link.href === "index.html") ||
                         (link.href === "../design-system.html" && filename === "design-system.html");
                         
        const linkClass = isActive 
            ? "sidebar-link flex items-center px-3 py-2.5 text-sm rounded-md transition-all duration-200 active"
            : "sidebar-link flex items-center px-3 py-2.5 text-sm rounded-md transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900";
            
        const iconColorClass = isActive ? "text-brand-500" : "text-slate-400";

        linksHtml += `
            <a href="${link.href}" class="${linkClass}">
                <svg class="w-4 h-4 mr-3 ${iconColorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    ${link.icon}
                </svg>
                ${link.label}
            </a>
        `;
    });

    placeholder.innerHTML = `
        <aside class="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10 relative">
            <div class="p-6 border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-display font-bold text-xl shadow-md">
                        M
                    </div>
                    <h1 class="font-display font-bold text-xl tracking-tight text-slate-900">Monet Wiki</h1>
                </div>
                <p class="text-xs text-slate-500 mt-2 font-medium uppercase tracking-wider">Documentation</p>
            </div>
            
            <div class="flex-1 overflow-y-auto py-4">
                <nav class="space-y-1 px-3">
                    ${linksHtml}
                </nav>
            </div>
            
            <div class="p-4 border-t border-slate-100 bg-slate-50">
                <div class="text-xs text-slate-500 flex items-center justify-between">
                    <span>Generated automatically</span>
                    <span class="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">2026-05-10</span>
                </div>
            </div>
        </aside>
    `;
});
