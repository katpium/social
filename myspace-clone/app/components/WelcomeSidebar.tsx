type Props = {
    title: string;
    subtitle?: string;
    bullets: string[];
};

export default function WelcomeSidebar({ title, subtitle, bullets }: Props) {
    return (
        <div className="welcome-box">
            <h2 className="welcome-title">{title}</h2>
            {subtitle && <p className="welcome-tag">{subtitle}</p>}
            <ul className="welcome-list">
                {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                ))}
            </ul>
            <p className="welcome-quote">
                <em>♪ established 2006 ♪</em>
            </p>
        </div>
    );
}
