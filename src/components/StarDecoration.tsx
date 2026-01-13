import './StarDecoration.css';

interface StarDecorationProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const StarDecoration = ({ className = '', size = 'md' }: StarDecorationProps) => {
    return (
        <div className={`star-decoration star-${size} ${className}`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 2L13.09 8.26L19 7L14.74 11.09L21 14L14.74 12.91L19 19L12 14.74L5 19L9.26 12.91L3 14L9.26 11.09L5 7L10.91 8.26L12 2Z"
                    fill="url(#starGradient)"
                />
                <defs>
                    <linearGradient id="starGradient" x1="3" y1="2" x2="21" y2="19">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default StarDecoration;
