import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import FoodGrid from "../../components/food/FoodGrid";
import { getFoods } from "../../services/foodService";

import heroImage from "../../assets/hero.png";


function Home() {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const loadFoods = async () => {

      try {

        const data = await getFoods({
          is_available: true,
          page: 1,
          limit: 4,
        });

        setFoods(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        setError(
          "Unable to load foods. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


    loadFoods();

  }, []);


  return (
    <div className="home-page">


      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-container">


          {/* HERO TEXT */}

          <div className="hero-content">

            <p className="hero-small-text">
              FRESH • DELICIOUS • EASY
            </p>

            <h1>
              Delicious Food,
              <br />
              Delivered to
              <br />
              Your Cravings.
            </h1>

            <p className="hero-description">
              Discover delicious meals, add your
              favourites to cart and place your
              order easily with CraveCart.
            </p>


            <div className="hero-actions">

              <Link
                to="/foods"
                className="hero-button"
              >
                Explore Foods
              </Link>

              <a
                href="#how-it-works"
                className="hero-secondary-button"
              >
                How It Works
              </a>

            </div>


            <div className="hero-features">

              <span>
                ✓ Easy Ordering
              </span>

              <span>
                ✓ Fresh Choices
              </span>

              <span>
                ✓ Simple Checkout
              </span>

            </div>

          </div>


          {/* HERO IMAGE */}

          <div className="hero-image-wrapper">

            <div className="hero-image-background"></div>

            <img
              src={heroImage}
              alt="Delicious CraveCart food"
              className="hero-image"
            />

            <div className="hero-floating-card">
              <span className="hero-floating-icon">
                ★
              </span>

              <div>
                <strong>
                  Delicious Choices
                </strong>

                <p>
                  Made for your cravings
                </p>
              </div>
            </div>

          </div>


        </div>

      </section>


      {/* FEATURED FOODS */}

      <section className="home-food-section">

        <div className="section-heading">

          <div>

            <p className="section-small-title">
              OUR MENU
            </p>

            <h2>
              Featured Foods
            </h2>

            <p className="section-description">
              Explore some delicious choices
              available on CraveCart.
            </p>

          </div>


          <Link
            to="/foods"
            className="view-all-link"
          >
            View All Foods →
          </Link>

        </div>


        {loading && (
          <p className="home-message">
            Loading foods...
          </p>
        )}


        {error && (
          <p className="home-error">
            {error}
          </p>
        )}


        {!loading && !error && (
          <FoodGrid foods={foods} />
        )}

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how-it-works-section"
        id="how-it-works"
      >

        <div className="how-it-works-container">

          <div className="home-center-heading">

            <p className="section-small-title">
              SIMPLE & EASY
            </p>

            <h2>
              How CraveCart Works
            </h2>

            <p>
              Your favourite food is only
              a few simple steps away.
            </p>

          </div>


          <div className="how-it-works-grid">


            <div className="how-card">

              <div className="how-card-number">
                01
              </div>

              <div className="how-card-icon">
                🔍
              </div>

              <h3>
                Explore Foods
              </h3>

              <p>
                Browse our menu and find the
                food you are craving.
              </p>

            </div>


            <div className="how-card">

              <div className="how-card-number">
                02
              </div>

              <div className="how-card-icon">
                🛒
              </div>

              <h3>
                Add to Cart
              </h3>

              <p>
                Add your favourite items and
                choose the quantity you need.
              </p>

            </div>


            <div className="how-card">

              <div className="how-card-number">
                03
              </div>

              <div className="how-card-icon">
                ✓
              </div>

              <h3>
                Place Your Order
              </h3>

              <p>
                Enter your details, confirm
                your cart and place your order.
              </p>

            </div>


          </div>

        </div>

      </section>


      {/* BOTTOM CTA */}

      <section className="home-cta-section">

        <div className="home-cta-content">

          <div>

            <p className="home-cta-small">
              READY TO ORDER?
            </p>

            <h2>
              Find something you'll love.
            </h2>

            <p>
              Explore CraveCart and choose
              your next favourite meal.
            </p>

          </div>


          <Link
            to="/foods"
            className="home-cta-button"
          >
            Browse Menu
          </Link>

        </div>

      </section>


    </div>
  );

}


export default Home;