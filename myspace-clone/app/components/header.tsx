export default function header() {
    return (
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

    );
}