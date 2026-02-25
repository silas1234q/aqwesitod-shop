import BestSellers from "../components/BestSellers/BestSellers";
import Category from "../components/Category/Category";
import Hero from "../components/Hero/Hero";
import Lookbook from "../components/LookBook/LookBook";
import NewCollection from "../components/New Collection/NewCollection";
import Newsletter from "../components/NewsLetter/NewsLetter";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
      <Hero />

      {/* New Collection Section */}
      <section className="py-12  bg-[#FAF9F6]">
        <NewCollection />
      </section>

      {/* Category Section */}
      <section className="py-12  bg-white">
        <Category />
      </section>

      <section className="py-12  bg-white">
        <BestSellers />
      </section>
      <section className="py-12  bg-white">
        <Lookbook />
      </section>
      <section className=" bg-white">
        <Newsletter />
      </section>
    </div>
  );
};

export default Home;
