import Ipbase from "@everapi/ipbase-js";
import moment from "moment";

// Selecting Elements by ID's
const quoteSection = document.getElementById("wordQuatations");
const timeSection = document.getElementById("time");
const detailSection = document.getElementById("timezone");
const toggleButton = document.getElementById("switch-more-less");
const toggleText = document.getElementsByClassName("switch-button-text")[0];
const mainContainer = document.getElementsByClassName("content-container")[0];
const toggleIcon = document.getElementById("switch-button-icon");
const quoteRefreshBtn = document.getElementById("new-quote-button");

// Selecting the quotes and locations by ID's
const quoteDisplay = document.getElementById("random-quote");
const quoteWriter = document.getElementById("quote-author");
const placeTag = document.getElementsByClassName("city-country")[0];
const localTime = document.getElementById("location-time");
const zoneTag = document.getElementById("location-timezone");
const yearDayTag = document.getElementById("day-of-year");
const weekDayTag = document.getElementById("day-of-week");
const weekTag = document.getElementById("week-number");
const zoneNameTag = document.getElementById("the-timezone");
const greetingTag = document.getElementById("when");
const iconImage = document.getElementById("sun-moon-icon-image");

let lat, lon;
let city = "";
let nation = "";
let quoteMessage = "";
let quoteCreator = "";
let bgImage = "/bg-image-daytime.jpg";

// Initial icon
toggleText.textContent === "MORE"
  ? (toggleIcon.src = "/icon-arrow-down.svg")
  : (toggleIcon.src = "/icon-arrow-up.svg");

toggleIcon.classList.toggle("p-3", toggleText.textContent === "MORE");

// Toggle Buttons
toggleButton.addEventListener("click", () => {
  const isMore = toggleText.textContent === "MORE";
  toggleText.textContent = isMore ? "LESS" : "MORE";
  toggleIcon.src = isMore ? "/icon-arrow-up.svg" : "/icon-arrow-down.svg";
  toggleIcon.classList.toggle("p-3", !isMore);
  detailSection.classList.toggle("hidden", !isMore);
  quoteSection.classList.toggle("hidden", isMore);
  if (isMore) detailSection.classList.add("bg-gray-200");
});

// Default quotes refreshing
quoteRefreshBtn.addEventListener("click", fetchQuote);

// IP & time fetch
const ipbase = new Ipbase("ipb_live_tmnTT1JG6ZYgX18dXvLhRq5guKRn9q94NMhNQuta");
async function loadUserDetails() {
  try {
    const response = await ipbase.info();

    city = response.data.location?.city?.name || "Unknown";
    lat = response.data.location?.latitude;
    lon = response.data.location?.longitude;
    nation = response.data.location?.country?.name;
    placeTag.textContent = `${city.toUpperCase()}, ${nation.toUpperCase()}`;
    console.log("Location:", city, nation);
    console.log("Latitude:", lat);
    console.log("Longitude:", lon);
    console.log("IP:", response.data.ip);
    console.log("City:", city);

    await fetchQuote();
    await fetchTimeDetails();
  } catch (err) {
    console.error("Location fetch failed:", err);
  }
}

function weeksSinceStartOfYear(dateString) {
  const inputDate = new Date(dateString);
  const startOfYear = new Date(inputDate.getFullYear(), 0, 1); // January 1st of the year

  const msInWeek = 7 * 24 * 60 * 60 * 1000; // milliseconds in a week
  const diffInMs = inputDate - startOfYear;
  const weeks = Math.floor(diffInMs / msInWeek) + 1; // +1 to start counting from week 1

  return weeks;
}

// Function  Fetching the time details directly using fixed coordinates (Banjul)

async function fetchTimeDetails() {
  try {
    const res = await fetch(
      "https://timeapi.io/api/time/current/coordinate?latitude=13.410329818725586&longitude=-16.70815086364746"
    );
    const data = await res.json();

    const hour = data.hour;
    const datetime = data.dateTime;

    //  Updating  the UI
    localTime.textContent = data.time;
    zoneTag.textContent = data.timeZone;
    yearDayTag.textContent = `${data.month}/${data.day}/${data.year}`;
    weekDayTag.textContent = data.dayOfWeek;
    weekTag.textContent = weeksSinceStartOfYear(
      `${data.month}/${data.day}/${data.year}`
    );
    zoneNameTag.textContent = data.timeZone;

    //  Setting greetings and background
    if (hour >= 5 && hour < 12) {
      greetingTag.textContent = "GOOD MORNING, IT'S CURRENTLY";
      iconImage.src = "/icon-sun.svg";
      bgImage = "/bg-image-daytime.jpg";
    } else if (hour >= 12 && hour < 18) {
      greetingTag.textContent = "GOOD AFTERNOON, IT'S CURRENTLY";
      iconImage.src = "/icon-sun.svg";
      bgImage = "/bg-image-daytime.jpg";
    } else {
      greetingTag.textContent = "GOOD EVENING, IT'S CURRENTLY";
      iconImage.src = "/icon-moon.svg";
      bgImage = "/bg-image-nighttime.jpg";
    }

    updateBackground();
  } catch (err) {
    console.error("Error fetching time details:", err);
  }
}

async function fetchQuote() {
  try {
    const res = await fetch("https://quotes-api-self.vercel.app/quote");
    const data = await res.json();
    quoteMessage = data.quote;
    quoteCreator = data.author;
    quoteDisplay.textContent = quoteMessage;
    quoteWriter.textContent = quoteCreator;
  } catch (err) {
    console.error("Quote fetch failed:", err);
  }
}

// Changing background Images(updating)
function updateBackground() {
  mainContainer.className = "content-container";

  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const isTablet = window.matchMedia("(max-width: 1000px)").matches;

  const mobileImage = bgImage.includes("daytime")
    ? "url('/mobile/bg-image-daytime.jpg')"
    : "url('/mobile/bg-image-nighttime.jpg')";

  const tabletImage = bgImage.includes("daytime")
    ? "url('/tablet/bg-image-daytime.jpg')"
    : "url('/tablet/bg-image-nighttime.jpg')";

  const desktopImage = bgImage;

  if (isMobile) {
    mainContainer.style.backgroundImage = mobileImage;
  } else if (isTablet) {
    mainContainer.style.backgroundImage = tabletImage;
  } else {
    mainContainer.style.backgroundImage = `url('${desktopImage}')`;
  }

  mainContainer.classList.add(
    "bg-cover",
    "bg-center",
    "bg-no-repeat",
    "bg-black/50",
    "bg-blend-overlay"
  );
}

window.addEventListener("resize", updateBackground);

// End of function (calling the function)
loadUserDetails();
updateBackground();
