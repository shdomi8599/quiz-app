const breakpoints = {
  mobile: "576px",
  tablet: "768px",
  desktop: "1200px",
};

const mediaQueries = {
  mobile: `(max-width: ${breakpoints.mobile})`,
  tablet: `(max-width: ${breakpoints.tablet})`,
  desktop: `(max-width: ${breakpoints.desktop})`,
};

const colors = {
  main: "#001529",
  mainHover: "#1677ff",
  sub: "#1677ff",
};

const theme = {
  mediaQueries,
  colors,
};

export default theme;
