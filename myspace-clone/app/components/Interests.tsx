import EditableField from "./EditableField";

type InterestsProps = {
    username: string;
    name: string;
    interests: {
        general: string;
        music: string;
        movies: string;
        television: string;
        books: string;
        heroes: string;
    };
    canEdit: boolean;
};

const ROWS: { key: keyof InterestsProps["interests"]; label: string }[] = [
    { key: "general", label: "General" },
    { key: "music", label: "Music" },
    { key: "movies", label: "Movies" },
    { key: "television", label: "Television" },
    { key: "books", label: "Books" },
    { key: "heroes", label: "Heroes" },
];

export default function Interests({ username, name, interests, canEdit }: InterestsProps) {
    return (
        <div className="interests-box">
            <h2 className="box-title">{name}&apos;s Interests</h2>

            <table className="interests-table">
                <tbody>
                    {ROWS.map((row) => (
                        <tr key={row.key}>
                            <th>{row.label}</th>
                            <td>
                                <EditableField
                                    username={username}
                                    field={`interests.${row.key}`}
                                    value={interests[row.key]}
                                    canEdit={canEdit}
                                    multiline
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
