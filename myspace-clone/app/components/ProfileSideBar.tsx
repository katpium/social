type ProfileSideBarProps = {
  name : string;
  status: string;
  mood: string;
}

export default function ProfileSideBar (props: ProfileSideBarProps){
    return (
        <>
        <h2>{props.name}</h2>

          <p>[edit photo]</p>

          <img
            src="/profile.png"
            alt="profile"
          />

          <p>{props.status}</p>

          <p>[edit]</p>

          <h2>ONLINE!</h2>

          <p>
            <strong>Mood:</strong> {props.mood} [edit]
          </p>

          <p>
            <strong>View my:</strong>

            <a href="#blog"> Blog </a>

            <a href="#pic"> Pics </a>

            <a href="#video"> Videos </a>
          </p>
        </>
    );
}