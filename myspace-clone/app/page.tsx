import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main>

      <header className="header">
        <h1>MySpace Clone</h1>

        <div className="search-bar">
          <h2>Search Users:</h2>

          <input type="text" />

          <button className="search-button">
            Search
          </button>
        </div>
      </header>

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

          <div className="profile-box">
            <h2>Edit Your Profile</h2>
          </div>

          <h2>
            John's Latest Blog Entries [View Blog]
          </h2>

          <div className="about-box">

            <h2 className="box-title">
              John's Blurbs
            </h2>

            <h2 className="section-title">
              <strong>About me:</strong>
            </h2>

            <p>
              I've been doing alot of morning exercise!
            </p>

            <p>[edit]</p>

            <h2 className="section-title">
              Who I'd like to meet:
            </h2>

            <p>[edit]</p>

          </div>

        </section>

      </main>

    </main>
  );
}