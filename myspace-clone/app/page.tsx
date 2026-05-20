import header from "./components/header"
import NavBar from "./components/NavBar";
import ProfileSideBar from "./components/ProfileSideBar"
import ProfileBox from "./components/Profilebox";
import BlogEntry from "./components/BlogEntry";
import AboutBox from "./components/AboutBox";

export default function Home() {
  
  const users = [
    {
      name: "John",
      status: "Living!",
      mood: "content",
      about: "I like to hike",
      answer: "",
    },

    {
      name: "Levi",
      status: "Alright",
      mood: "neutral",
      about: "I like to stay home",
      answer: "no one.",
    },

    {
      name: "Ben",
      status: "over",
      mood: "excited",
      about: "Howdy partner!",
      answer: "Sofia Veragara",
    },
  ];

  return ( //use for UI (JSX, HTML-stuff)
    <main>

      <header />
      <NavBar />

        {users.map((user) => (
        <div className="container" key = "user.name">

          <section className="section-left">
            <ProfileSideBar
            name = {user.name}
            status = {user.status}
            mood = {user.mood}  
          />

          </section>

          <section className="section-right">

            <ProfileBox />

            <BlogEntry />

            <AboutBox 
            about = {user.about}
            answer = {user.answer}
          />
          </section>
          </div>
        ))}

      </main>
  );
}