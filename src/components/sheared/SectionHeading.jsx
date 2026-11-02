 const SectionHeading = ({ eyebrow, title, description }) =>{
    return(
<div className="mx-auto mb-12 max-w-3xl text-center">
    {eyebrow && (
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-light">
        {eyebrow}
      </p>
    )}
    <h2>{title}</h2>
    {description && <p className="mt-4 text-muted">{description}</p>}
  </div>
 )}

 export default SectionHeading;