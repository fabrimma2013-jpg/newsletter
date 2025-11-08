import React from 'react';

interface IconProps {
    className?: string;
}

const BaseIcon: React.FC<React.PropsWithChildren<IconProps>> = ({ className, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
        {children}
    </svg>
);


export const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </BaseIcon>
);

export const MicIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line>
    </BaseIcon>
);

export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </BaseIcon>
);

export const StopCircleIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect>
    </BaseIcon>
);

export const UserIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </BaseIcon>
);

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </BaseIcon>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>
    </BaseIcon>
);

export const BellIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </BaseIcon>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></BaseIcon>
);

export const PillIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></BaseIcon>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></BaseIcon>
);

export const ImageIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></BaseIcon>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></BaseIcon>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="m12.24 3.92.59 1.19.2.41.45.1.08.01 1.3.19.09.01.62.09.1.02.95.14.1.02.26.04.1.02.04.01.07.01.08.01.12.02.08.01.16.03.08.01.12.02.08.01.08.01.08.01.12.02.04.01.08.01.08.01.04.01.08.01.04.01.04.01.04.01.04.01.04.01.04.01.03.01h.01l.03.01h.02l.02.01h.02l.02.01h.02l.02.01h.01l.02.01h.01l.02.01h.01l.01.01h.01l.01.01h.01l.01.01h.01l.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.01.0_1_z"></path><path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z"></path></BaseIcon>
);

export const LoadingIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={`animate-spin ${className}`}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></BaseIcon>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></BaseIcon>
);

export const BookIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5z"></path></BaseIcon>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></BaseIcon>
);

export const PayPalIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
        <path d="M8.32,21.185a.723.723,0,0,1-.714-.833,10.31,10.31,0,0,1,1.018-4.21,1.144,1.144,0,0,1,1.13-.762h2.83a.473.473,0,0,0,.47-.492c-.06-3.414-.42-6.522-3.018-6.522-2.1,0-3.3,1.621-3.784,3.22a.962.962,0,0,1-1.01.762H2.915a.723.723,0,0,1-.714-.833A10.45,10.45,0,0,1,5.2,3.12,1.144,1.144,0,0,1,6.329,2.358h4.516a.473.473,0,0,1,.47.492c.036.216.2.828.624,2.58h.048a6.38,6.38,0,0,1,4.1-1.488c2.826,0,4.28,1.956,3.69,5.718-.468,2.982-2.1,4.6-4.6,4.6-1.554,0-2.436-.888-2.9-1.98l-.066-.156a.466.466,0,0,0-.564-.312H9.957a.723.723,0,0,0-.714.833,8.041,8.041,0,0,0,1.03,3.726,1.144,1.144,0,0,1-1.13.762Z"/>
    </svg>
);

export const MobileMoneyIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></BaseIcon>
);

export const CloseIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></BaseIcon>
);

export const PlusIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></BaseIcon>
);

export const HeartIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></BaseIcon>
);

export const ActivityIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></BaseIcon>
);

export const SunIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></BaseIcon>
);

export const MoonIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </BaseIcon>
);

export const ScaleIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M16 16.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
        <path d="M3 3v18h18" />
        <path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 10 0 5 5 0 0 1-5 5z" />
    </BaseIcon>
);

export const DropletIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C3 11.1 2 13 2 15a7 7 0 0 0 7 7z" />
    </BaseIcon>
);

export const LungsIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M12 22c-5 0-9-4.5-9-9V7a5 5 0 0 1 10 0v1a1 1 0 0 0 2 0V7a5 5 0 0 1 10 0v6c0 4.5-4 9-9 9z" />
        <path d="M8 12H5" />
        <path d="M19 12h-3" />
        <path d="M8 8H5" />
        <path d="M19 8h-3" />
        <path d="M12 12v-2" />
        <path d="M12 8V6" />
    </BaseIcon>
);

export const StethoscopeIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M4.8 2.3A.3.3 0 1 0 5.4 2l-1.5-1.6A.3.3 0 1 0 3 1.2l1.8 1.1Z"/>
        <path d="M18.2 2.3A.3.3 0 1 0 17.6 2l1.5-1.6A.3.3 0 1 0 20 1.2l-1.8 1.1Z"/>
        <path d="M12 11a7 7 0 0 0-7-7h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1a7 7 0 0 0 7 7v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-7a7 7 0 0 0 7-7h1a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-1a7 7 0 0 0-7 7Z"/>
    </BaseIcon>
);

export const ResetIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
    </BaseIcon>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </BaseIcon>
);

export const BarChartIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
    </BaseIcon>
);

export const ShieldIcon: React.FC<IconProps> = ({ className }) => (
    <BaseIcon className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </BaseIcon>
);
