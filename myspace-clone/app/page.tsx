import header from "./components/header"
import NavBar from "./components/NavBar";
import ProfileSideBar from "./components/ProfileSideBar"
import ProfileBox from "./components/Profilebox";
import BlogEntry from "./components/BlogEntry";
import AboutBox from "./components/AboutBox";




export default function Home() {
  return (
    <main>

      <header />
      <Navbar />

        <main className="container">

          <section className="section-left">

          <h2>John</h2>

          <p>[edit photo]</p>

          <img
            src="/profile.png"
            alt="profile"
          />

          <p>Living!</p>

          <p>[edit]</p>

          <h2>ONLINE!</h2>

          <p>
            <strong>Mood:</strong> Content [edit]
          </p>

          <p>
            <strong>View my:</strong>

            <a href="#blog"> Blog </a>

            <a href="#pic"> Pics </a>

            <a href="#video"> Videos </a>
          </p>

          </section>

          <section className="section-right">

            <ProfileBox />

            <BlogEntry />

            <AboutBox />
          </section>

        </main>

      </main>
  );
}