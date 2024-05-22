import { Oswald, Rajdhani, Roboto, Inter, Rubik } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload:false
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  preload:false
});
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500"], preload:false });
export { rajdhani, rubik, inter, roboto, oswald };
