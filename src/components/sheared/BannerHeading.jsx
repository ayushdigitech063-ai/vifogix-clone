const alignStyles = {
  left:   { box: "mr-auto text-left",   actions: "justify-start" },
  center: { box: "mx-auto text-center", actions: "justify-center" },
  right:  { box: "ml-auto text-right",  actions: "justify-end" },
};

const responsiveStyles = {
  left:   { box: "mx-auto text-center md:ml-0 md:mr-auto md:text-left",  actions: "justify-center md:justify-start" },
  center: alignStyles.center,
  right:  { box: "mx-auto text-center md:ml-auto md:mr-0 md:text-right", actions: "justify-center md:justify-end" },
};

const widthStyles = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  full: "max-w-none",
};

const toneStyles = {
  light: { eyebrow: "text-primary-light", title: "",           description: "text-muted" },
  dark:  { eyebrow: "text-accent-yellow", title: "text-white", description: "text-white/80" },
   warm:  { eyebrow: "text-accent-red",    title: "",           description: "text-fg/70" },
};

export const Highlight = ({ children }) => (
  <span className="text-primary group-data-[tone=dark]/banner:text-accent-yellow">
    {children}
  </span>
);

const BannerHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  centerOnMobile = false,
  tone = "light",
  titleClassName ="",
  as: Tag = "h2",
  maxWidth = "lg",
  className = "",
  children,
}) => {
  const styles = (centerOnMobile ? responsiveStyles : alignStyles)[align] ?? alignStyles.center;
  const colors = toneStyles[tone] ?? toneStyles.light;

  return (
    <div
      data-tone={tone}
      className={`group/banner ${styles.box} ${widthStyles[maxWidth] ?? widthStyles.lg} ${className}`}
    >
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-wider ${colors.eyebrow}`}>
          {eyebrow}
        </p>
      )}

      <Tag className={`${colors.title} ${titleClassName}`}>
        {title}
        {highlight && (
          <>
            {" "}
            <Highlight>{highlight}</Highlight>
          </>
        )}
      </Tag>

      {description && <p className={`mt-4 text-lg ${colors.description}`}>{description}</p>}

      {children && (
        <div className={`mt-8 flex flex-wrap gap-4 ${styles.actions}`}>{children}</div>
      )}
    </div>
  );
};

export default BannerHeading;