import header from "./components/header"
import NavBar from "./components/NavBar";
import ProfileBox from "./components/Profilebox";
import BlogEntry from "./components/BlogEntry";
import AboutBox from "./components/AboutBox";
import ProfileSideBar from "./components/ProfileSideBar";

export default function Home() {
  return (
    <main>
      <h1> Just checking</h1>
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