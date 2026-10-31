import React from "react";
import { ArrowUpRight, Leaf } from "lucide-react";
export const productInfoLabels = {
  brand: "Brand",
  category: "Category",
  type: "Product type",
  skinType: "Skin type",
  packaging: "Packaging",
  price: "Price",
  size: "Size",
};
export default function ProductExperience({ event, onPolls }) {
  return (
    <>
      <section className="guest-hero">
        <div>
          <p className="eyebrow">A RETURN TO WHAT FEELS NATURAL</p>
          <h1>{event.productName}</h1>
          <p className="guest-tagline">{event.tagline}</p>
          <div className="product-description">
            {event.productAbout.split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {onPolls && (
            <button className="botanical-button" onClick={onPolls}>
              Join the conversation <ArrowUpRight size={18} />
            </button>
          )}
          <span className="botanical-note">
            <Leaf size={17} />A little nature. A daily ritual.
          </span>
        </div>
        <div className="guest-image">
          <img src={event.image} alt={event.productName} />
          <span>
            {event.productInfo?.brand || "THE PRODUCT"} COLLECTION · LAUNCH
            EDITION
          </span>
        </div>
      </section>
      {!!event.productIncluded?.length && (
        <section className="product-section">
          <p className="eyebrow">THOUGHTFULLY CURATED</p>
          <h2>What’s included</h2>
          <div className="product-trio">
            {event.productIncluded.map((item, i) => (
              <article key={i}>
                <span className="product-number">0{i + 1}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {!!event.productSteps?.length && (
        <section className="product-section ritual-section">
          <p className="eyebrow">YOUR EVERYDAY RITUAL</p>
          <h2>How to use</h2>
          <ol className="product-trio">
            {event.productSteps.map((step, i) => (
              <li key={i}>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      {event.productInfo && (
        <section className="product-section product-information">
          <div>
            <p className="eyebrow">THE DETAILS, CONSIDERED</p>
            <h2>Product information</h2>
          </div>
          <dl>
            {Object.entries(productInfoLabels).map(([key, label]) => (
              <div key={key}>
                <dt>{label}</dt>
                <dd>{event.productInfo[key] || "To be confirmed"}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {event.productWhy && (
        <section className="guest-story">
          <p className="eyebrow">SIMPLE. INTENTIONAL. BEAUTIFUL.</p>
          <h2>Why choose {event.productInfo?.brand || "this collection"}?</h2>
          <p>{event.productWhy}</p>
        </section>
      )}
    </>
  );
}
