type AboutBoxProps = {
    about: string;
    answer: string;
}

export default function AboutBox(props: AboutBoxProps) {
    return (
        <>
        <div className="about-box">

            <h2 className="box-title">
              John's Blurbs
            </h2>

            <h2 className="section-title">
              <strong>About me:</strong>
            </h2>

            <p>
              {props.about}
            </p>

            <p>[edit]</p>

            <h2 className="section-title">
              Who I'd like to meet:
            </h2>

            <p>{props.answer}</p>

            <p>[edit]</p>

          </div>
        </>

    );
}