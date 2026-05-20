import EditableField from "./EditableField";

type AboutBoxProps = {
    username: string;
    name: string;
    about: string;
    answer: string;
    canEdit: boolean;
};

export default function AboutBox(props: AboutBoxProps) {
    return (
        <div className="about-box">
            <h2 className="box-title">{props.name}&apos;s Blurbs</h2>

            <h2 className="section-title">
                <strong>About me:</strong>
            </h2>
            <div className="blurb-text">
                <EditableField
                    username={props.username}
                    field="about"
                    value={props.about}
                    canEdit={props.canEdit}
                    multiline
                    placeholder="(nothing here yet)"
                />
            </div>

            <h2 className="section-title">Who I&apos;d like to meet:</h2>
            <div className="blurb-text">
                <EditableField
                    username={props.username}
                    field="answer"
                    value={props.answer}
                    canEdit={props.canEdit}
                    multiline
                    placeholder="(nothing here yet)"
                />
            </div>
        </div>
    );
}
