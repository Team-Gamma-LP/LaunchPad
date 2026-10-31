import React, { useState } from "react";
import { Check } from "lucide-react";
import ProductExperience, {
  productInfoLabels,
} from "../components/ProductExperience";
import { ConfirmDelete } from "../components/RecordDialog";

export default function Product({ c, session, update, setNotice }) {
  const [preview, setPreview] = useState(false);
  const [mode, setMode] = useState("view"), [deleting, setDeleting] = useState(false);
  const event = c.event;
  if (event.deletedAt) return <section className="card empty"><p className="eyebrow">LAUNCH DELETED</p><h2>{event.title}</h2><p>The event and product are hidden from guests. Invitations, check-in and voting are paused. Your records are retained.</p><button className="primary" onClick={() => { if(update(s => {delete s.clients[session.clientId].event.deletedAt;})) {setMode("edit");setNotice("Launch restored. You can edit its details.");} }}>Restore & edit launch</button></section>;
  return (
    <>
      <section className="card launch-controls"><div><p className="eyebrow">YOUR LAUNCH</p><h3>{event.title}</h3><p className="muted">Manage the event and the product your guests discover.</p></div><div className="row-actions"><button className={mode === "view" ? "primary" : "secondary"} onClick={() => {setMode("view");setPreview(false);}}>View launch</button><button className={mode === "edit" ? "primary" : "secondary"} onClick={() => setMode("edit")}>Edit launch</button><button className="danger" onClick={() => setDeleting(true)}>Delete launch</button></div></section>
      {mode === "view" ? <><section className="card"><dl className="record-details">{[["Event",event.title],["Date & time",new Date(event.date).toLocaleString()],["Venue",event.venue],["Capacity",event.capacity],["About the event",event.about]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></section><section className="admin-guest-preview"><div className="section-title"><h3>Saved guest experience</h3></div><div className="guest-page"><ProductExperience event={event} /></div></section></> : <>
      <section className="card">
        <div className="section-title">
          <div>
            <h3>Set the scene</h3>
            <p className="muted">
              Save your product details, then preview exactly what your guests
              will see.
            </p>
          </div>
          <button className="secondary" onClick={() => setPreview(!preview)}>
            {preview ? "Hide guest preview" : "Preview guest page"}
          </button>
        </div>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget));
            const productIncluded = [0, 1, 2].map((i) => ({
              name: data[`includedName${i}`],
              description: data[`includedDescription${i}`],
            }));
            const productSteps = [0, 1, 2].map((i) => ({
              name: data[`stepName${i}`],
              description: data[`stepDescription${i}`],
            }));
            const productInfo = Object.fromEntries(
              Object.keys(productInfoLabels).map((key) => [
                key,
                data[`info_${key}`],
              ]),
            );
            const eventData = Object.fromEntries(
              Object.entries(data).filter(
                ([key]) =>
                  !key.startsWith("included") &&
                  !key.startsWith("step") &&
                  !key.startsWith("info_"),
              ),
            );
            const saved = update((s) =>
              Object.assign(s.clients[session.clientId].event, {
                ...eventData,
                productIncluded,
                productSteps,
                productInfo,
                capacity: Number(data.capacity),
              }),
            );
            if (saved) {
              setMode("view");
              setNotice(
                "Product and event details saved. Guest pages now use these details.",
              );
            }
          }}
        >
          {[
            ["title", "Event title"],
            ["date", "Event date and time"],
            ["venue", "Venue"],
            ["capacity", "Guest capacity"],
            ["productName", "Product name"],
            ["tagline", "Product tagline"],
            ["image", "Product image URL"],
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                name={name}
                required
                defaultValue={c.event[name]}
                type={
                  name === "date"
                    ? "datetime-local"
                    : name === "capacity"
                      ? "number"
                      : "text"
                }
                min={name === "capacity" ? 1 : undefined}
              />
            </label>
          ))}
          <label>
            About the event
            <textarea name="about" required defaultValue={c.event.about} />
          </label>
          <fieldset className="product-fieldset">
            <legend>What’s included</legend>
            {[0, 1, 2].map((i) => (
              <div className="editor-pair" key={i}>
                <label>
                  Item {i + 1} name
                  <input
                    name={`includedName${i}`}
                    required
                    defaultValue={c.event.productIncluded?.[i]?.name || ""}
                  />
                </label>
                <label>
                  Item {i + 1} description
                  <textarea
                    name={`includedDescription${i}`}
                    required
                    defaultValue={
                      c.event.productIncluded?.[i]?.description || ""
                    }
                  />
                </label>
              </div>
            ))}
          </fieldset>
          <fieldset className="product-fieldset">
            <legend>How to use</legend>
            {[0, 1, 2].map((i) => (
              <div className="editor-pair" key={i}>
                <label>
                  Step {i + 1} name
                  <input
                    name={`stepName${i}`}
                    required
                    defaultValue={c.event.productSteps?.[i]?.name || ""}
                  />
                </label>
                <label>
                  Step {i + 1} directions
                  <textarea
                    name={`stepDescription${i}`}
                    required
                    defaultValue={c.event.productSteps?.[i]?.description || ""}
                  />
                </label>
              </div>
            ))}
          </fieldset>
          <fieldset className="product-fieldset">
            <legend>Product information</legend>
            {Object.entries(productInfoLabels).map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  name={`info_${key}`}
                  required
                  defaultValue={c.event.productInfo?.[key] || ""}
                />
              </label>
            ))}
          </fieldset>
          <label>
            Why choose this product?
            <textarea
              name="productWhy"
              required
              defaultValue={c.event.productWhy || ""}
            />
          </label>
          <label>
            About the product
            <textarea
              name="productAbout"
              required
              defaultValue={c.event.productAbout}
            />
          </label>
          <label>
            Or upload an image{" "}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 1500000) {
                  setNotice(
                    "Choose an image smaller than 1.5 MB for browser storage.",
                  );
                  return;
                }
                const r = new FileReader();
                r.onload = () => {
                  e.target.form.elements.image.value = r.result;
                };
                r.readAsDataURL(file);
              }}
            />
          </label>
          <button className="primary">
            Save launch details <Check size={16} />
          </button>
        </form>
      </section>
      {preview && (
        <section className="admin-guest-preview">
          <div className="section-title">
            <h3>Guest preview</h3>
            <span className="muted">Your saved product details</span>
          </div>
          <div className="guest-page">
            <ProductExperience event={c.event} />
          </div>
        </section>
      )}
      </>}
      {deleting && <ConfirmDelete title="Delete this launch?" description="This hides the event and product from guests and pauses invitations, admissions and voting. Guest, team and poll records are retained. You can restore the launch here." onClose={() => setDeleting(false)} onConfirm={() => {if(update(s => {s.clients[session.clientId].event.deletedAt = new Date().toISOString();})) {setDeleting(false);setNotice("Launch deleted. Guest access, admissions and voting are paused.");}}} />}
    </>
  );
}
