import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FoodGrid from "../../components/food/FoodGrid";
import { getFoods } from "../../services/foodService";
import { getCategories } from "../../services/categoryService";
import heroImage from "../../assets/hero.png";

function Home() {

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadHome = async () => {
      try {
        setLoading(true);
        setError("");
        const [foodData, categoryData] = await Promise.all([
          getFoods({ is_available: true, sort: "created_at", order: "desc", page: 1, limit: 4 }),
          getCategories(),
        ]);
        setFoods(Array.isArray(foodData) ? foodData : []);
        setCategories(Array.isArray(categoryData) ? categoryData.slice(0, 6) : []);
      } catch (error) {
        console.error("Failed to load home page:", error);
        setError("Unable to load foods. Please try again.");
      } finally {

        setLoading(false);

      }

    };
    loadHome();
  }, []);


  return (
    <div className="home-page">

      <section className="hero-section">

        <div className="hero-container">

          <div className="hero-content">
            <div className="hero-eyebrow"><span /> Fresh food, simple ordering</div>
            <h1>Your next <em>craving</em><br />is only a few<br />clicks away.</h1>
            <p className="hero-description">
              Discover food you love, build your cart and place your order without the fuss.
            </p>
            <div className="hero-actions">
              <Link to="/foods" className="hero-button">Explore the menu <span>→</span></Link>
              <a href="#how-it-works" className="hero-secondary-button">How it works</a>
            </div>
            <div className="hero-features">
              <span><b>01</b> Browse</span><span><b>02</b> Add to cart</span><span><b>03</b> Enjoy</span>
            </div>

          </div>

          <div className="hero-image-wrapper">
            
            <div className="hero-image-background" />
            <img src={heroImage} alt="Delicious CraveCart food" className="hero-image" />
            <div className="hero-floating-card">
              <span className="hero-floating-icon">★</span>
              <div><strong>Made for cravings</strong><p>Fresh choices, easy ordering</p></div>
            </div>

          </div>

        </div>

      </section>

      <section className="home-featured-section">
        <div className="home-section-container">
          <div className="home-section-heading split-heading">
            <div><p className="section-small-title">FRESH FROM THE MENU</p><h2>Popular picks for you</h2><p>Good food, ready when the craving hits.</p></div>
            <Link to="/foods" className="text-link">Explore all foods →</Link>
          </div>
          {loading && <div className="home-message">Loading delicious choices...</div>}
          {error && <div className="home-error">{error}</div>}
          {!loading && !error && foods.length > 0 && <FoodGrid foods={foods} />}
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="home-section-container">
          <div className="how-intro">
            <p className="section-small-title">HOW IT WORKS</p>
            <h2>From craving to cart.<br /><em>Three easy steps.</em></h2>
          </div>
          <div className="how-grid">
            <article className="how-card"><span>01</span><div className="how-icon">⌕</div><h3>Find your food</h3><p>Browse the menu, search your favourites and discover something delicious.</p></article>
            <article className="how-card"><span>02</span><div className="how-icon">＋</div><h3>Build your cart</h3><p>Choose what you want, set the quantity and review your order anytime.</p></article>
            <article className="how-card"><span>03</span><div className="how-icon">✓</div><h3>Place your order</h3><p>Add your details, confirm the order and follow its progress from your account.</p></article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
