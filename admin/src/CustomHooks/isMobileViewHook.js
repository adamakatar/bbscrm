export function isMobileViewHook(setIsMobile, width = 992) {
  window.addEventListener("load", () => {
    getWidthAndDecideScreen(setIsMobile, width);
  });
  window.addEventListener("resize", () => {
    getWidthAndDecideScreen(setIsMobile, width);
  });
  getWidthAndDecideScreen(setIsMobile, width);
}

function getWidthAndDecideScreen(setIsMobile, width) {
  if (window.screen.width < width || window.innerWidth < width) {
    setIsMobile(true);
  } else {
    setIsMobile(false);
  }
}
