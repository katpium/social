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
        <NavBar />

        <main className="container">

          <section className="section-left">

            <ProfileSideBar />

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