// Framed figure — the color-bearing element in an otherwise monochrome design.
// With no image it shows the hatch placeholder + "DROP HERE" caption; with an
// image it shows the photo full-bleed with caption + italic role overlaid.
export default function Figure({
  caption,
  role,
  image,
  alt,
}: {
  caption: string;
  role?: string;
  image?: string;
  alt?: string;
}) {
  return (
    <div className={`figure${image ? " figure--has-img" : ""}`}>
      {image ? (
        <img className="figure__img" src={image} alt={alt || role || caption} />
      ) : (
        <div className="figure__hatch" />
      )}
      <div className="figure__cap">{caption}</div>
      {role && <div className="figure__role">{role}</div>}
    </div>
  );
}
